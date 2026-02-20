import { generateSummary } from "../services/ai.service.js";
import Blog from "../models/Blog.js";

/**
 * POST /api/ai/blog-summary
 * Input: { content: "...", blogId: "...", force: false }
 */
export const getBlogSummary = async (req, res) => {
  try {
    const { content, blogId, force } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Validation: Minimum 200 words
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 200) {
      return res.status(400).json({ 
        message: "Blog content must be at least 200 words long to generate a summary." 
      });
    }

    const summary = await generateSummary(content, blogId, force);

    res.json({ summary });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ message: "Internal server error during summary generation" });
  }
};
