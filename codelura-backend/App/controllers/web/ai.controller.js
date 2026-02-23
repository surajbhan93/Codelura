import natural from "natural";
import { removeStopwords } from "stopword";
import Blog from "../../models/Blog.js";
import { getRecommendations } from "../../services/recommendation.service.js";

const TfIdf = natural.TfIdf;

/* =======================
   Text Preprocessing
======================= */

const synonymMap = {
  authentication: "auth",
  authenticate: "auth",
  node: "nodejs",
  js: "nodejs",
  javascript: "nodejs",
  react: "reactjs",
  vue: "vuejs",
  python: "py",
  database: "db",
  mongodb: "mongo",
};

const preprocessText = (text) => {
  if (!text) return "";

  let words = text
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  words = words.map((w) => synonymMap[w] || w);
  return removeStopwords(words).join(" ");
};

/* =======================
   Utility Functions
======================= */

const cosineSimilarity = (vecA, vecB) => {
  const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  let dot = 0;
  let magA = 0;
  let magB = 0;

  allTerms.forEach((term) => {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  });

  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const getVector = (tfidf, index) => {
  const vector = {};
  tfidf.listTerms(index).forEach(({ term, tfidf: score }) => {
    vector[term] = score;
  });
  return vector;
};

/* =======================
   Semantic Search API
======================= */

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    const blogs = await Blog.find({ isPublished: true }).select(
      "_id title content excerpt tags",
    );

    if (!blogs.length) {
      return res.json({ results: [] });
    }

    const tfidf = new TfIdf();

    blogs.forEach((blog) => {
      const text = preprocessText(
        `${blog.title} ${blog.excerpt || ""} ${blog.content || ""} ${(blog.tags || []).join(" ")}`,
      );
      tfidf.addDocument(text);
    });

    const cleanQuery = preprocessText(query);
    tfidf.addDocument(cleanQuery);

    const queryVector = getVector(tfidf, blogs.length);

    const results = blogs
      .map((blog, i) => {
        const blogVector = getVector(tfidf, i);
        const score = cosineSimilarity(queryVector, blogVector);

        return {
          blogId: blog._id.toString(),
          title: blog.title,
          score: Number(score.toFixed(2)),
        };
      })
      .filter((r) => r.score >= 0.4)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return res.status(200).json({ results });
  } catch (error) {
    console.error("Semantic Search Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* =======================
   Content Recommendation API
   POST /ai/recommendations
   (STRICT SPEC BASED)
======================= */

export const contentRecommendations = async (req, res) => {
  try {
    const { blogId, category } = req.body;

    // ✅ blogId validation (Mongo ObjectId)
    if (!blogId || typeof blogId !== "string") {
      return res.status(400).json({
        message: "blogId is required",
      });
    }

    const objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(blogId)) {
      return res.status(400).json({
        message: "Invalid blogId format",
      });
    }

    // 🔁 Delegate logic to service
    const recommendations = await getRecommendations(blogId, category || null, {
      contentWeight: 0.7,
      categoryWeight: 0.3,
      minScore: 0.1,
      limit: 5,
    });

    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Content Recommendation Error:", error);

    if (error.message === "Source blog not found") {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (
      error.message ===
      "Source blog has insufficient content for recommendations"
    ) {
      return res.status(400).json({
        message: "Blog has insufficient content for recommendations",
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
