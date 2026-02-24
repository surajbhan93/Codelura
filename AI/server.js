
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

const ALLOWED_FLAGS = [
  "SHORT_DESCRIPTION",
  "MISSING_GITHUB",
  "GENERIC_IDEA",
  "UNCLEAR_IMPLEMENTATION",
  "WELL_DEFINED_PROJECT"
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

function wordCount(text) {
  return text.trim().split(/\s+/).length;
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
