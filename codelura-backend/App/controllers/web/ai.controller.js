import { GoogleGenerativeAI } from "@google/generative-ai";
import Blog from "../../models/Blog.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Fallback Summary Logic (Rule-based)
 * Splits content into sentences and ranks them by word frequency.
 */
const generateFallbackSummary = (content) => {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
  
  // Simple word frequency ranking
  const words = content.toLowerCase().match(/\w+/g) || [];
  const freq = {};
  words.forEach(w => {
    if (w.length > 3) freq[w] = (freq[w] || 0) + 1;
  });

  const scoredSentences = sentences.map((s, index) => {
    const sWords = s.toLowerCase().match(/\w+/g) || [];
    let score = 0;
    sWords.forEach(w => score += (freq[w] || 0));
    return { sentence: s.trim(), score: score / (sWords.length || 1), index };
  });

  // Sort by score to find top 3, then re-sort by original index
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .sort((a, b) => a.index - b.index)
    .map(s => s.sentence);

  return topSentences.join(" ");
};

/**
 * POST /api/ai/blog-summary
 * Generates a 3-5 line summary for blog content.
 */
export const generateBlogSummary = async (req, res) => {
  try {
    const { content, blogId, force } = req.body;

    // 1. Validation
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 200) {
      return res.status(400).json({ message: "Minimum 200 words required for summary" });
    }

    // 2. Caching Check
    let blog = null;
    if (blogId) {
      blog = await Blog.findById(blogId);
      if (blog && blog.summary && !force) {
        return res.json({ summary: blog.summary });
      }
    }

    // 3. AI Summary Generation
    let summary = "";
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are an AI assistant.

Task:
Summarize the following blog content in 3–5 concise lines.

Guidelines:
- Use simple and clear language
- Capture the main idea and key points
- Avoid repetition and filler phrases
- Do not add new information
- Do not mention "this blog" or "the article"

Blog Content:
${content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      summary = response.text().trim();

      // Basic cleanup if AI adds markdown or multiple lines
      summary = summary.replace(/[*#]/g, "").replace(/\s+/g, " ");

    } catch (aiError) {
      console.warn("AI Summary Generation Failed, falling back to rule-based logic 👉", aiError.message);
      summary = generateFallbackSummary(content);
    }

    // 4. Update Cache
    if (blog) {
      blog.summary = summary;
      await blog.save();
    }

    res.json({ summary });


  } catch (error) {
    console.error("BLOG SUMMARY ERROR 👉", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/ai/generate-tags
 * Generates 5-8 relevant SEO tags for blog content.
 */
export const generateBlogTags = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    let tags = [];
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Extract 5-8 relevant SEO tags from the following content. Return only the tags as a comma-separated list, no other text.\n\nContent:\n${content}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      tags = text.split(",").map(t => t.trim().replace(/^#/, ""));
    } catch (error) {
      console.warn("AI Tag Generation Failed, using fallback", error.message);
      // Fallback: simple keyword extraction (top words > 5 chars)
      const words = content.toLowerCase().match(/\w+/g) || [];
      const freq = {};
      words.forEach(w => { if (w.length > 5) freq[w] = (freq[w] || 0) + 1; });
      tags = Object.keys(freq).sort((a,b) => freq[b] - freq[a]).slice(0, 5);
    }

    res.json({ tags });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/ai/generate-seo
 * Generates Meta Title and Meta Description.
 */
export const generateBlogSEO = async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    let seo = { metaTitle: title || "", metaDescription: "" };
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Based on the blog title "${title}" and content, generate a SEO-friendly Meta Title (max 60 chars) and Meta Description (max 160 chars). Return as JSON format: {"metaTitle": "...", "metaDescription": "..."}. No other text.\n\nContent:\n${content}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Clean possible markdown code blocks
      const jsonStr = text.replace(/```json|```/g, "").trim();
      seo = JSON.parse(jsonStr);
    } catch (error) {
      console.warn("AI SEO Generation Failed, using fallback", error.message);
      // Fallback
      seo.metaTitle = title ? `${title} | Codelura` : "Blog Post | Codelura";
      seo.metaDescription = content.slice(0, 155).trim() + "...";
    }

    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

