import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── In-memory cache { submissionId: feedbackObject } ──
const feedbackCache = {};

// ── Metrics tracker ──
const metrics = {
    total: 0,
    ai_generated: 0,
    rule_based: 0,
    ai_failures: 0
};

// ─────────────────────────────────────────────
// RULE-BASED FALLBACK
// ─────────────────────────────────────────────
function generateRuleBasedFeedback({ innovationScore, feasibilityScore, impactScore }) {
    const lines = [];

    // Innovation
    if (innovationScore >= 8)
        lines.push("Your project demonstrates strong innovation and creative thinking.");
    else if (innovationScore >= 5)
        lines.push("Your project shows a reasonable level of innovation with room to push further.");
    else
        lines.push("Consider exploring more unique or creative angles for your project idea.");

    // Feasibility
    if (feasibilityScore < 5)
        lines.push("Implementation feasibility could be improved with a clearer technical plan.");
    else if (feasibilityScore >= 8)
        lines.push("The technical approach is well thought out and practically achievable.");

    // Impact
    if (impactScore >= 7)
        lines.push("The project has meaningful real-world potential and addresses a genuine need.");
    else
        lines.push("Strengthening the real-world impact of your solution would make it more compelling.");

    // Return max 3 lines
    return lines.slice(0, 3).join(" ");
}

// ─────────────────────────────────────────────
// AI CALL CONTROL - check if AI should be called
// ─────────────────────────────────────────────
function shouldCallAI({ classificationLevel, plagiarismLevel }) {
    if (classificationLevel === "LOW")  return false;
    if (plagiarismLevel === "HIGH")     return false;
    return true;
}

// ─────────────────────────────────────────────
// VALIDATE OUTPUT - ensure feedback meets rules
// ─────────────────────────────────────────────
function validateFeedback(text) {
    if (!text || text.trim().length === 0) return false;

    const lines = text.trim().split("\n").filter(l => l.trim().length > 0);
    if (lines.length > 3) return false;                      // max 3 lines
    if (/[*_`#]/.test(text)) return false;                   // no markdown
    if (/^[-•]/.test(text.trim())) return false;             // no bullet points
    if (/[\u{1F300}-\u{1FFFF}]/u.test(text)) return false;  // no emojis

    return true;
}

// ─────────────────────────────────────────────
// MAIN FUNCTION: Generate Feedback
// ─────────────────────────────────────────────
export async function generateFeedback(data, force = false) {
    const {
        submissionId,
        projectTitle,
        innovationScore,
        feasibilityScore,
        impactScore,
        classificationLevel,
        plagiarismLevel
    } = data;

    // ── Return cached feedback if exists ──
    if (!force && feedbackCache[submissionId]) {
        return feedbackCache[submissionId];
    }

    metrics.total++;

    let feedbackText  = null;
    let feedbackType  = "RULE_BASED";

    // ── Try AI if conditions are met ──
    if (shouldCallAI({ classificationLevel, plagiarismLevel })) {
        try {
            const model  = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: {
                    temperature:     0.5,   // stable output
                    maxOutputTokens: 150,   // strict token limit
                }
            });

            const prompt = `You are an expert hackathon mentor.
Task:
Generate short feedback (2–3 lines only) for a hackathon project based on the given evaluation data.

Guidelines:
- Be constructive and professional
- Do not repeat numeric scores
- Do not exceed 3 lines
- Do not use markdown or bullet points
- Do not exaggerate
- Keep it concise and helpful

Input:
Project Title: ${projectTitle}
Innovation Score: ${innovationScore}
Feasibility Score: ${feasibilityScore}
Impact Score: ${impactScore}
Classification Level: ${classificationLevel}
Plagiarism Level: ${plagiarismLevel}

Return:
Plain text only.`;

            const result   = await model.generateContent(prompt);
            const response = result.response.text().trim();

            if (validateFeedback(response)) {
                feedbackText = response;
                feedbackType = "AI_GENERATED";
                metrics.ai_generated++;
            } else {
                // AI returned invalid output, use fallback
                throw new Error("AI output failed validation");
            }

        } catch (err) {
            // AI failed - use fallback silently
            metrics.ai_failures++;
            feedbackText = generateRuleBasedFeedback({ innovationScore, feasibilityScore, impactScore });
            feedbackType = "RULE_BASED";
            metrics.rule_based++;
        }

    } else {
        // Conditions not met - use fallback directly
        feedbackText = generateRuleBasedFeedback({ innovationScore, feasibilityScore, impactScore });
        feedbackType = "RULE_BASED";
        metrics.rule_based++;
    }

    // ── Build response object ──
    const feedbackResult = {
        submissionId,
        feedback:     feedbackText,
        feedbackType,
        generatedAt:  new Date().toISOString()
    };

    // ── Cache the result ──
    feedbackCache[submissionId] = feedbackResult;

    return feedbackResult;
}

// ── Export metrics getter ──
export function getMetrics() {
    return {
        ...metrics,
        ai_vs_rule_ratio: metrics.total > 0
            ? `${((metrics.ai_generated / metrics.total) * 100).toFixed(1)}% AI / ${((metrics.rule_based / metrics.total) * 100).toFixed(1)}% Rule-based`
            : "No feedback generated yet",
        estimated_cost_per_hackathon: `~$${(metrics.ai_generated * 0.001).toFixed(3)} USD`,
    };
}