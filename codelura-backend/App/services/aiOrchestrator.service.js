import { GoogleGenerativeAI } from "@google/generative-ai";
import EvaluationModel, { createEvaluation } from "../models/Evaluation.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─────────────────────────────────────────────
// AI USAGE MONITOR - tracks all AI calls
// ─────────────────────────────────────────────
const aiUsageMonitor = {
    totalCalls:     0,
    callsPerModule: { classifier: 0, plagiarism: 0, judging: 0, feedback: 0 },
    callsBlocked:   0,
    fallbackCount:  0,
    estimatedCost:  0,

    track(module) {
        this.totalCalls++;
        this.callsPerModule[module] = (this.callsPerModule[module] || 0) + 1;
        this.estimatedCost += 0.001; // ~$0.001 per call estimate
    },
    block()    { this.callsBlocked++; },
    fallback() { this.fallbackCount++; }
};

// ─────────────────────────────────────────────
// AI DECISION CONTROL
// Should AI be called for this submission?
// ─────────────────────────────────────────────
function shouldUseAI({ classificationLevel, plagiarismLevel, budgetAvailable = true }) {
    if (!budgetAvailable)              return false;
    if (classificationLevel === "LOW") return false;
    if (plagiarismLevel === "HIGH")    return false;
    return true;
}

// ─────────────────────────────────────────────
// HELPER - call Gemini safely with timeout
// ─────────────────────────────────────────────
async function callGeminiSafe(prompt, module) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { temperature: 0.5, maxOutputTokens: 200 }
    });

    // Timeout wrapper - fail after 10 seconds
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), 10000)
    );

    const aiCall = model.generateContent(prompt);
    const result = await Promise.race([aiCall, timeout]);

    aiUsageMonitor.track(module);
    return result.response.text().trim();
}

// ─────────────────────────────────────────────
// PART 1 - AI CLASSIFIER
// ─────────────────────────────────────────────
async function runClassifier(submission) {
    try {
        const prompt = `You are a hackathon submission classifier.
Classify this project into LOW, MEDIUM, or HIGH quality based on the title and description.
Project Title: ${submission.projectTitle}
Description: ${submission.description || "Not provided"}
Reply with ONLY one word: LOW, MEDIUM, or HIGH`;

        const response = await callGeminiSafe(prompt, "classifier");
        const level    = ["LOW", "MEDIUM", "HIGH"].includes(response.toUpperCase())
            ? response.toUpperCase()
            : "MEDIUM";

        return { level, confidence: 0.85, method: "AI" };

    } catch (err) {
        // Fallback classifier - rule based on title length
        aiUsageMonitor.fallback();
        const titleLength = (submission.projectTitle || "").length;
        const level = titleLength > 30 ? "HIGH" : titleLength > 15 ? "MEDIUM" : "LOW";
        return { level, confidence: 0.5, method: "RULE_BASED" };
    }
}

// ─────────────────────────────────────────────
// PART 2 - AI PLAGIARISM CHECK
// ─────────────────────────────────────────────
async function runPlagiarismCheck(submission) {
    try {
        const prompt = `You are a plagiarism detector for hackathon projects.
Based on the project title and description, estimate plagiarism risk.
Project Title: ${submission.projectTitle}
Description: ${submission.description || "Not provided"}
Reply with ONLY one word: LOW, MEDIUM, or HIGH`;

        const response = await callGeminiSafe(prompt, "plagiarism");
        const level    = ["LOW", "MEDIUM", "HIGH"].includes(response.toUpperCase())
            ? response.toUpperCase()
            : "LOW";

        return { level, score: level === "LOW" ? 10 : level === "MEDIUM" ? 50 : 80, method: "AI" };

    } catch (err) {
        // Fallback - assume LOW plagiarism
        aiUsageMonitor.fallback();
        return { level: "LOW", score: 0, method: "RULE_BASED" };
    }
}

// ─────────────────────────────────────────────
// PART 3 - AI JUDGING
// ─────────────────────────────────────────────
async function runAIJudging(submission) {
    try {
        const prompt = `You are a hackathon judge. Score this project.
Project Title: ${submission.projectTitle}
Description: ${submission.description || "Not provided"}
Return ONLY a JSON object like this (no markdown, no extra text):
{"innovationScore": 7, "feasibilityScore": 6, "impactScore": 8}
Scores must be between 1 and 10.`;

        const response = await callGeminiSafe(prompt, "judging");

        // Clean response - remove markdown if present
        const cleaned = response.replace(/```json|```/g, "").trim();
        const scores  = JSON.parse(cleaned);

        // Validate scores are numbers between 1-10
        const innovation  = Math.min(10, Math.max(1, Number(scores.innovationScore)  || 5));
        const feasibility = Math.min(10, Math.max(1, Number(scores.feasibilityScore) || 5));
        const impact      = Math.min(10, Math.max(1, Number(scores.impactScore)      || 5));

        return { innovationScore: innovation, feasibilityScore: feasibility, impactScore: impact, method: "AI" };

    } catch (err) {
        // Fallback - rule based scoring
        aiUsageMonitor.fallback();
        const titleWords = (submission.projectTitle || "").split(" ").length;
        const baseScore  = Math.min(8, Math.max(3, titleWords));
        return { innovationScore: baseScore, feasibilityScore: baseScore - 1, impactScore: baseScore, method: "RULE_BASED" };
    }
}

// ─────────────────────────────────────────────
// PART 4 - FEEDBACK GENERATION
// ─────────────────────────────────────────────
function generateRuleBasedFeedback({ innovationScore, feasibilityScore, impactScore }) {
    const lines = [];
    if (innovationScore >= 8)
        lines.push("Your project demonstrates strong innovation and creative thinking.");
    else if (innovationScore >= 5)
        lines.push("Your project shows a reasonable level of innovation with room to push further.");
    else
        lines.push("Consider exploring more unique or creative angles for your project idea.");

    if (feasibilityScore < 5)
        lines.push("Implementation feasibility could be improved with a clearer technical plan.");
    else if (feasibilityScore >= 8)
        lines.push("The technical approach is well thought out and practically achievable.");

    if (impactScore >= 7)
        lines.push("The project has meaningful real-world potential and addresses a genuine need.");
    else
        lines.push("Strengthening the real-world impact of your solution would make it more compelling.");

    return { text: lines.slice(0, 3).join(" "), type: "RULE_BASED" };
}

async function runFeedbackGeneration({ submissionId, projectTitle, innovationScore, feasibilityScore, impactScore, classificationLevel, plagiarismLevel }) {
    try {
        const prompt = `You are an expert hackathon mentor.
Generate short feedback (2-3 lines only) for a hackathon project.
Guidelines: Be constructive, no markdown, no bullet points, max 3 lines, plain text only.
Project Title: ${projectTitle}
Innovation Score: ${innovationScore}
Feasibility Score: ${feasibilityScore}
Impact Score: ${impactScore}
Classification: ${classificationLevel}
Plagiarism: ${plagiarismLevel}
Return plain text only.`;

        const response = await callGeminiSafe(prompt, "feedback");
        return { text: response, type: "AI_GENERATED" };

    } catch (err) {
        aiUsageMonitor.fallback();
        return generateRuleBasedFeedback({ innovationScore, feasibilityScore, impactScore });
    }
}

// ─────────────────────────────────────────────
// MAIN ORCHESTRATOR FUNCTION
// ─────────────────────────────────────────────
export async function processSubmissionAI(submissionId, submissionData) {
    // Create or update evaluation record
    let evaluation = await EvaluationModel.findOne({ submissionId });
    if (!evaluation) {
        evaluation = createEvaluation(submissionId, submissionData.projectTitle);
    }

    evaluation.pipelineStatus = "PROCESSING";
    await evaluation.save();

    const aiModulesUsed = [];

    try {
        // ── STEP 1: Classification ──────────────
        const classification = await runClassifier(submissionData);
        evaluation.classificationResult = classification;
        if (classification.method === "AI") aiModulesUsed.push("classifier");

        // ── STEP 2: Plagiarism Check ────────────
        const plagiarism = await runPlagiarismCheck(submissionData);
        evaluation.plagiarismResult = plagiarism;
        if (plagiarism.method === "AI") aiModulesUsed.push("plagiarism");

        // ── STEP 3: AI Decision Control ─────────
        const aiAllowed = shouldUseAI({
            classificationLevel: classification.level,
            plagiarismLevel:     plagiarism.level,
            budgetAvailable:     true
        });

        if (!aiAllowed) aiUsageMonitor.block();

        // ── STEP 4: Judging ─────────────────────
        let scores;
        if (aiAllowed) {
            scores = await runAIJudging(submissionData);
            if (scores.method === "AI") aiModulesUsed.push("judging");
        } else {
            // Rule-based scoring fallback
            scores = {
                innovationScore:  5,
                feasibilityScore: 5,
                impactScore:      5,
                method:           "RULE_BASED"
            };
        }

        evaluation.innovationScore  = scores.innovationScore;
        evaluation.feasibilityScore = scores.feasibilityScore;
        evaluation.impactScore      = scores.impactScore;

        // Calculate final score (weighted average)
        const ruleScore  = Math.round((scores.innovationScore + scores.feasibilityScore + scores.impactScore) / 3 * 10) / 10;
        const finalScore = ruleScore;

        evaluation.ruleScore       = ruleScore;
        evaluation.finalScore      = finalScore;
        evaluation.evaluationType  = aiAllowed && scores.method === "AI" ? "AI" : "RULE";

        // ── STEP 5: Feedback Generation ─────────
        const feedback = await runFeedbackGeneration({
            submissionId,
            projectTitle:        submissionData.projectTitle,
            innovationScore:     scores.innovationScore,
            feasibilityScore:    scores.feasibilityScore,
            impactScore:         scores.impactScore,
            classificationLevel: classification.level,
            plagiarismLevel:     plagiarism.level
        });

        if (feedback.type === "AI_GENERATED") aiModulesUsed.push("feedback");

        evaluation.feedback      = feedback.text;
        evaluation.feedbackType  = feedback.type;
        evaluation.aiModulesUsed = aiModulesUsed;
        evaluation.pipelineStatus = "COMPLETED";
        evaluation.processedAt   = new Date();

        await evaluation.save();
        return evaluation;

    } catch (err) {
        // ── FAIL SAFE - never block leaderboard ──
        evaluation.pipelineStatus = "FAILED";
        evaluation.evaluationType = "RULE";
        evaluation.ruleScore      = 5;
        evaluation.finalScore     = 5;
        evaluation.feedback       = "Thank you for your submission. Our team will review it shortly.";
        evaluation.feedbackType   = "RULE_BASED";
        evaluation.processedAt    = new Date();
        await evaluation.save();
        return evaluation;
    }
}

// ── Export usage monitor ──
export function getAIUsageStats() {
    return {
        totalCalls:     aiUsageMonitor.totalCalls,
        callsPerModule: aiUsageMonitor.callsPerModule,
        callsBlocked:   aiUsageMonitor.callsBlocked,
        fallbackCount:  aiUsageMonitor.fallbackCount,
        estimatedCost:  `~$${aiUsageMonitor.estimatedCost.toFixed(3)} USD`
    };
}