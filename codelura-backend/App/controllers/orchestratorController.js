import { processSubmissionAI, getAIUsageStats } from "../services/aiOrchestrator.service.js";
import Evaluation from "../models/Evaluation.js";

// POST /api/ai/process-submission
export const processSubmission = async (req, res) => {
    const { submissionId, projectTitle, description } = req.body;

    if (!submissionId || !projectTitle) {
        return res.status(400).json({ error: "submissionId and projectTitle are required" });
    }

    try {
        const result = await processSubmissionAI(submissionId, { projectTitle, description });
        res.json({ success: true, evaluation: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// GET /api/admin/ai-usage
export const getAIUsage = (req, res) => {
    res.json({ success: true, ...getAIUsageStats() });
};

// GET /api/ai/evaluation/:submissionId
export const getEvaluation = async (req, res) => {
    const evaluation = await Evaluation.findOne({ submissionId: req.params.submissionId });
    if (!evaluation) return res.status(404).json({ error: "Evaluation not found" });
    res.json({ success: true, evaluation });
};