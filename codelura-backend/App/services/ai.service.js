import { GoogleGenerativeAI } from "@google/generative-ai";
import natural from "natural";
import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const aiModel = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

/**
 * Fallback logic: TF-IDF based sentence ranking
 */
const fallbackSummary = (content) => {
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(content);

  if (sentences.length <= 3) return sentences.join(" ");

  const tfidf = new natural.TfIdf();
  
  // Add each sentence as a document to TF-IDF
  sentences.forEach((sentence) => tfidf.addDocument(sentence));

  const rankedSentences = sentences.map((sentence, index) => {
    let score = 0;
    const words = sentence.toLowerCase().match(/\w+/g) || [];
    
    words.forEach((word) => {
      tfidf.tfidfs(word, (docIndex, tfidfScore) => {
        if (docIndex === index) {
          score += tfidfScore;
        }
      });
    });

    return { sentence, score, index };
  });

  // Sort by score descending and take top 3
  const topSentences = rankedSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Re-sort by original index to preserve order
  return topSentences
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence)
    .join(" ");
};

export const generateSummary = async (content, blogId = null, forceRefresh = false) => {
  // 1. Caching Check
  if (blogId && mongoose.Types.ObjectId.isValid(blogId) && !forceRefresh) {
    const blog = await Blog.findById(blogId);
    if (blog && blog.summary) {
      return blog.summary;
    }
  }

  // 2. AI Generation
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
${content}

⚠️ Do not modify the prompt without approval.`;

  let summary = "";

  if (aiModel) {
    try {
      const result = await aiModel.generateContent(prompt);
      const response = await result.response;
      summary = response.text().trim()
        .replace(/[*#>`-]/g, "") // Remove common markdown characters
        .replace(/\s+/g, " ")     // Collapse multiple spaces/newlines into one
        .trim();
    } catch (error) {
      console.error("Gemini AI API Error:", error.message);
      // 3. Fallback Logic
      summary = fallbackSummary(content);
    }
  } else {
    console.warn("Gemini API key missing. Falling back to TF-IDF.");
    summary = fallbackSummary(content);
  }

  // 4. Cache the result if blogId is provided and valid
  if (blogId && mongoose.Types.ObjectId.isValid(blogId)) {
    await Blog.findByIdAndUpdate(blogId, { summary });
  }

  return summary;
};
