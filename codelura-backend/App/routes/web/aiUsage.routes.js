import express from "express";
import { makeUsageDecision, getUsageStats } from "../../controllers/web/aiUsage.controller.js";

const router = express.Router();

router.post("/usage-decision", makeUsageDecision);
router.get("/usage-stats", getUsageStats);

export default router;