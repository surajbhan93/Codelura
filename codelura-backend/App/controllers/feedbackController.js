import { generateFeedback, getMetrics } from "../services/feedbackService.js";

// POST /api/ai/generate-feedback
export const generateFeedbackController = async (req, res) => {
    const {
        submissionId,
        projectTitle,
        innovationScore,
        feasibilityScore,
        impactScore,
        classificationLevel,
        plagiarismLevel,
        force
    } = req.body;

    // ── Validate required fields ──
    if (!submissionId || !projectTitle ||
        innovationScore === undefined ||
        feasibilityScore === undefined ||
        impactScore === undefined ||
        !classificationLevel || !plagiarismLevel) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["submissionId", "projectTitle", "innovationScore",
                       "feasibilityScore", "impactScore",
                       "classificationLevel", "plagiarismLevel"]
        });
    }

    const result = await generateFeedback(req.body, force === true);

    res.json({ feedback: result.feedback, feedbackType: result.feedbackType });
};

// GET /api/ai/metrics
export const getMetricsController = (req, res) => {
    res.json(getMetrics());
};