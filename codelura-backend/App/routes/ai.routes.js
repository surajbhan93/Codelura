import express from "express";
import { getBlogSummary } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/blog-summary", getBlogSummary);

export default router;
