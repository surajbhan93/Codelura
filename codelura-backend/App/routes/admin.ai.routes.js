import express from "express";
import { getAIUsage } from "../controllers/orchestratorController.js";

const router = express.Router();

// GET /api/admin/ai-usage
router.get("/ai-usage", getAIUsage);

export default router;