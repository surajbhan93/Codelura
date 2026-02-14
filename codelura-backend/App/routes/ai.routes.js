import express from "express";
import { 
  generateBlogSummary, 
  generateBlogTags, 
  generateBlogSEO 
} from "../controllers/web/ai.controller.js";

const router = express.Router();

// ✅ AI GENERATION ROUTES
router.post("/blog-summary", generateBlogSummary);
router.post("/generate-tags", generateBlogTags);
router.post("/generate-seo", generateBlogSEO);


export default router;
