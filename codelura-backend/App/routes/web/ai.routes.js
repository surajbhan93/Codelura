import express from "express";
import { semanticSearch, contentRecommendations } from "../../controllers/web/ai.controller.js";

const router = express.Router();

// Semantic search endpoint
router.post("/search", semanticSearch);

// Content recommendations endpoint
// POST /ai/recommendations
// Body: { blogId: string, category?: string }
router.post("/recommendations", contentRecommendations);

export default router;