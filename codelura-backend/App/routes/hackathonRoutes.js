import express from "express";
import HackathonController from "../controllers/HackathonController.js";

const router = express.Router();

/**
 * @route POST /api/hackathon/judge
 * @desc Evaluate a hackathon submission
 * @access Public (or add auth middleware if needed)
 */
router.post("/judge", HackathonController.judgeSubmission);

export default router;
