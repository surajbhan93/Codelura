
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory cache
const cache = new Map();
const plagiarismCache = new Map();
const plagiarismHistory = [];

const ALLOWED_FLAGS = [
  "SHORT_DESCRIPTION",
  "MISSING_GITHUB",
  "GENERIC_IDEA",
  "UNCLEAR_IMPLEMENTATION",
  "WELL_DEFINED_PROJECT"
];

const ALLOWED_PLAGIARISM_FLAGS = [
  "DUPLICATE_DESCRIPTION",
  "DUPLICATE_GITHUB",
  "GENERIC_TEMPLATE",
  "SYSTEM_FALLBACK"
];

const PROMPT_TEMPLATE = (title, description, stack, github) => `
You are an expert hackathon reviewer.

Task:
Classify the following hackathon submission.

Instructions:
- Do NOT score the project
- Do NOT add assumptions
- Only classify and flag
- Return STRICT JSON
- Be concise and objective

Input:
Title: ${title}
Description: ${description}
Tech Stack: ${JSON.stringify(stack)}
GitHub Link: ${github}

Return:
{
  "quality_level": "LOW | MEDIUM | HIGH",
  "ai_judging_required": true | false,
  "flags": [],
  "reason": "1–2 line explanation"
}
`;

const PLAGIARISM_PROMPT_TEMPLATE = (title, description, stack, github) => `
You are an expert reviewer detecting plagiarism in hackathon projects.

Task:
Determine whether the following project submission appears copied or generic.

Instructions:
- Compare logically, not emotionally
- Do NOT assume access to external sources
- Do NOT browse GitHub
- Return STRICT JSON only
- Be conservative in judgment

Input:
Title: ${title}
Description: ${description}
Tech Stack: ${JSON.stringify(stack)}
GitHub Link: ${github}

Return:
{
  "plagiarism_level": "LOW | MEDIUM | HIGH",
  "similarity_score": 0.0-1.0,
  "flags": [],
  "reason": "1–2 line explanation"
}
`;

function wordCount(text) {
  return text.trim().split(/\s+/).length;
}

function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized.split(" ");
}

function jaccardSimilarity(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function isGenericTemplate(description) {
  const text = normalizeText(description);
  if (!text) return false;

  const genericPhrases = [
    "innovative solution",
    "cutting edge",
    "revolutionize",
    "next generation",
    "ai powered",
    "end to end",
    "user friendly",
    "seamless experience",
    "modern platform",
    "scalable solution",
    "real time",
    "leverages ai",
    "smart solution",
    "comprehensive platform",
    "robust solution"
  ];

  const implementationKeywords = [
    "api",
    "database",
    "endpoint",
    "model",
    "algorithm",
    "react",
    "node",
    "express",
    "mongo",
    "sql",
    "pipeline",
    "microservice",
    "architecture",
    "deployment",
    "authentication",
    "authorization"
  ];

  const hasImplementationKeyword = implementationKeywords.some(k =>
    text.includes(k)
  );

  const genericHits = genericPhrases.filter(p => text.includes(p)).length;

  const words = tokenize(text);
  const uniqueWords = new Set(words);

  if (hasImplementationKeyword) return false;

  if (words.length >= 20 && genericHits >= 2) return true;

  if (words.length >= 30 && uniqueWords.size / words.length < 0.4) {
    return true;
  }

  return false;
}

function validateAIResponse(data) {
  if (!data) return false;
  if (!["LOW", "MEDIUM", "HIGH"].includes(data.quality_level)) return false;
  if (typeof data.ai_judging_required !== "boolean") return false;
  if (!Array.isArray(data.flags)) return false;
  if (!data.flags.every(flag => ALLOWED_FLAGS.includes(flag))) return false;
  if (typeof data.reason !== "string") return false;
  if (data.reason.split("\n").length > 2) return false;
  return true;
}

function validatePlagiarismResponse(data) {
  if (!data) return false;
  if (!["LOW", "MEDIUM", "HIGH"].includes(data.plagiarism_level)) return false;
  if (typeof data.similarity_score !== "number") return false;
  if (data.similarity_score < 0 || data.similarity_score > 1) return false;
  if (!Array.isArray(data.flags)) return false;
  if (!data.flags.every(flag => ALLOWED_PLAGIARISM_FLAGS.includes(flag))) return false;
  if (typeof data.reason !== "string") return false;
  if (data.reason.split("\n").length > 2) return false;
  return true;
}

function clampSimilarity(score) {
  if (Number.isNaN(score)) return 0;
  if (score < 0) return 0;
  if (score > 1) return 1;
  return score;
}

function ruleBasedPlagiarismCheck(input) {
  const { submissionId, projectDescription, githubLink } = input;

  const flags = [];
  let plagiarism_level = "LOW";
  let similarity_score = 0;
  let reason = "No significant similarity detected.";

  const description = projectDescription || "";
  const descriptionWords = wordCount(description);

  if (descriptionWords < 10) {
    return {
      plagiarism_level: "LOW",
      similarity_score: 0,
      flags,
      reason: "Description too short for reliable plagiarism analysis."
    };
  }

  const currentTokens = tokenize(description);

  for (const prev of plagiarismHistory) {
    if (!prev.projectDescription) continue;
    if (prev.submissionId === submissionId) continue;

    const prevTokens = tokenize(prev.projectDescription);

    if (normalizeText(prev.projectDescription) === normalizeText(description)) {
      plagiarism_level = "HIGH";
      similarity_score = 1;
      if (!flags.includes("DUPLICATE_DESCRIPTION")) {
        flags.push("DUPLICATE_DESCRIPTION");
      }
      reason = "Description exactly matches a previous submission.";
      break;
    }

    const sim = jaccardSimilarity(currentTokens, prevTokens);
    if (sim > similarity_score) {
      similarity_score = sim;
    }
  }

  if (!flags.includes("DUPLICATE_DESCRIPTION")) {
    if (similarity_score >= 0.8) {
      plagiarism_level = "HIGH";
      flags.push("DUPLICATE_DESCRIPTION");
      reason = "Description is highly similar to a previous submission.";
    } else if (similarity_score >= 0.5) {
      plagiarism_level = "MEDIUM";
      flags.push("DUPLICATE_DESCRIPTION");
      reason = "Description is moderately similar to a previous submission.";
    }
  }

  if (githubLink) {
    const reused = plagiarismHistory.some(
      prev =>
        prev.githubLink &&
        prev.githubLink === githubLink &&
        prev.submissionId !== submissionId
    );

    if (reused) {
      if (!flags.includes("DUPLICATE_GITHUB")) {
        flags.push("DUPLICATE_GITHUB");
      }
      if (plagiarism_level === "LOW") {
        plagiarism_level = "MEDIUM";
        if (similarity_score < 0.6) similarity_score = 0.6;
        if (!reason || reason === "No significant similarity detected.") {
          reason = "GitHub repository is reused across multiple submissions.";
        }
      }
    }
  }

  if (isGenericTemplate(description)) {
    if (!flags.includes("GENERIC_TEMPLATE")) {
      flags.push("GENERIC_TEMPLATE");
    }
    if (plagiarism_level !== "HIGH") {
      plagiarism_level = "MEDIUM";
    }
    if (similarity_score < 0.5) similarity_score = 0.5;
    if (!reason || reason === "No significant similarity detected.") {
      reason = "Description appears generic with limited implementation detail.";
    }
  }

  return {
    plagiarism_level,
    similarity_score: clampSimilarity(similarity_score),
    flags,
    reason
  };
}

function fallbackLogic(input) {
  const flags = [];
  const descriptionWords = wordCount(input.projectDescription || "");

  if (!input.githubLink) {
    flags.push("MISSING_GITHUB");
  }

  if (descriptionWords < 120) {
    flags.push("SHORT_DESCRIPTION");
    return {
      quality_level: "LOW",
      ai_judging_required: false,
      flags,
      reason: "Description too short. Fallback classification applied."
    };
  }

  return {
    quality_level: "MEDIUM",
    ai_judging_required: false,
    flags,
    reason: "AI unavailable. Defaulted to rule-based MEDIUM classification."
  };
}

app.post("/api/ai/plagiarism-check", async (req, res) => {
  try {
    const {
      submissionId,
      projectTitle,
      projectDescription,
      techStack,
      githubLink,
      force,
      classifierFlagged
    } = req.body;

    if (!submissionId) {
      return res.status(400).json({ error: "submissionId required" });
    }

    if (plagiarismCache.has(submissionId) && !force) {
      return res.json(plagiarismCache.get(submissionId));
    }

    const ruleResult = ruleBasedPlagiarismCheck({
      submissionId,
      projectDescription,
      githubLink
    });

    const descriptionWords = wordCount(projectDescription || "");
    const canUseAI =
      descriptionWords >= 20 &&
      ruleResult.plagiarism_level !== "HIGH" &&
      ruleResult.similarity_score >= 0.4 &&
      ruleResult.similarity_score <= 0.7;

    const shouldUseAI = canUseAI || !!classifierFlagged;

    let finalResult = {
      plagiarism_level: ruleResult.plagiarism_level,
      similarity_score: clampSimilarity(ruleResult.similarity_score),
      flags: [...ruleResult.flags],
      reason: ruleResult.reason
    };

    if (shouldUseAI) {
      const prompt = PLAGIARISM_PROMPT_TEMPLATE(
        projectTitle,
        projectDescription,
        techStack,
        githubLink
      );

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          response_format: { type: "json_object" }
        });

        const raw = completion.choices[0].message.content;
        const parsed = JSON.parse(raw);

        if (!validatePlagiarismResponse(parsed)) {
          throw new Error("Invalid AI response format for plagiarism");
        }

        finalResult = {
          plagiarism_level: parsed.plagiarism_level,
          similarity_score: clampSimilarity(parsed.similarity_score),
          flags: parsed.flags,
          reason: parsed.reason
        };
      } catch (aiError) {
        const fallbackResult = {
          plagiarism_level: ruleResult.plagiarism_level,
          similarity_score: clampSimilarity(ruleResult.similarity_score),
          flags: Array.from(
            new Set([...ruleResult.flags, "SYSTEM_FALLBACK"])
          ),
          reason:
            ruleResult.reason ||
            "AI unavailable. Used rule-based similarity only."
        };
        finalResult = fallbackResult;
      }
    }

    plagiarismCache.set(submissionId, finalResult);

    const existingIndex = plagiarismHistory.findIndex(
      s => s.submissionId === submissionId
    );
    const submissionData = {
      submissionId,
      projectTitle,
      projectDescription,
      techStack,
      githubLink
    };
    if (existingIndex >= 0) {
      plagiarismHistory[existingIndex] = submissionData;
    } else {
      plagiarismHistory.push(submissionData);
    }

    return res.json(finalResult);
  } catch (err) {
    const safeFallback = {
      plagiarism_level: "LOW",
      similarity_score: 0,
      flags: ["SYSTEM_FALLBACK"],
      reason: "Unexpected error. Safe fallback response used."
    };
    return res.json(safeFallback);
  }
});

app.post("/api/ai/submission-classifier", async (req, res) => {
  try {
    const { submissionId, projectTitle, projectDescription, techStack, githubLink, force } = req.body;

    if (!submissionId) {
      return res.status(400).json({ error: "submissionId required" });
    }

    if (cache.has(submissionId) && !force) {
      return res.json(cache.get(submissionId));
    }

    const prompt = PROMPT_TEMPLATE(projectTitle, projectDescription, techStack, githubLink);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      });

      const raw = completion.choices[0].message.content;
      const parsed = JSON.parse(raw);

      if (!validateAIResponse(parsed)) {
        throw new Error("Invalid AI response format");
      }

      cache.set(submissionId, parsed);
      return res.json(parsed);

    } catch (aiError) {
      const fallback = fallbackLogic({
        projectDescription,
        githubLink
      });

      cache.set(submissionId, fallback);
      return res.json(fallback);
    }

  } catch (err) {
    return res.status(500).json({
      quality_level: "LOW",
      ai_judging_required: false,
      flags: ["UNCLEAR_IMPLEMENTATION"],
      reason: "Unexpected error. Safe fallback response returned."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
