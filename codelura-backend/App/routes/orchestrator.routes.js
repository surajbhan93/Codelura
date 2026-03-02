import express from "express";
import {
    processSubmission,
    getAIUsage,
    getEvaluation
} from "../controllers/orchestratorController.js";

const router = express.Router();

// Process a submission through full AI pipeline
router.post("/process-submission", processSubmission);

// Get evaluation result for a submission
router.get("/evaluation/:submissionId", getEvaluation);

export default router;