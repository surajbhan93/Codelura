import express from "express";
import {
    generateFeedbackController,
    getMetricsController
} from "../controllers/feedbackController.js";

const router = express.Router();

// POST /api/ai/generate-feedback
router.post("/generate-feedback", generateFeedbackController);

// GET /api/ai/metrics
router.get("/metrics", getMetricsController);

export default router;