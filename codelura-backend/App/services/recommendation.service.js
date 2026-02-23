import natural from "natural";
import { removeStopwords } from "stopword";
import mongoose from "mongoose";
import Blog from "../models/Blog.js";

const TfIdf = natural.TfIdf;

/* =======================
   CATEGORY NORMALIZATION
======================= */
const normalizeCategory = (cat = "") => {
  return cat
    .toLowerCase()
    .replace(/development|design|&/g, "")
    .trim();
};

/* =======================
   SYNONYMS
======================= */
const synonymMap = {
  js: "javascript",
  node: "nodejs",
  react: "reactjs",
  mongodb: "mongo",
  database: "db",
};

/* =======================
   RELATED CATEGORIES
======================= */
const relatedCategories = {
  frontend: ["javascript", "react", "css", "html"],
  backend: ["nodejs", "api", "database"],
  javascript: ["frontend", "nodejs"],
  react: ["frontend", "javascript"],
  database: ["backend"],
};

/* =======================
   HELPERS
======================= */
const preprocessText = (text = "") => {
  const words = text
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => synonymMap[w] || w);

  return removeStopwords(words).join(" ");
};

const cosineSimilarity = (a, b) => {
  let dot = 0,
    magA = 0,
    magB = 0;

  const terms = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const t of terms) {
    const x = a[t] || 0;
    const y = b[t] || 0;
    dot += x * y;
    magA += x * x;
    magB += y * y;
  }

  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
};

const getVector = (tfidf, index) => {
  const v = {};
  tfidf.listTerms(index).forEach(({ term, tfidf }) => (v[term] = tfidf));
  return v;
};

const getCategoryScore = (source, target) => {
  if (!source || !target) return 0;
  if (source === target) return 1;

  return relatedCategories[source]?.includes(target) ||
    relatedCategories[target]?.includes(source)
    ? 0.5
    : 0;
};

/* =======================
   MAIN RECOMMENDATION
======================= */
export const getRecommendations = async (
  blogId,
  category = null,
  {
    contentWeight = 0.7,
    categoryWeight = 0.3,
    minScore = 0.35,
    limit = 5,
  } = {},
) => {
  let sourceBlog = null;

  /* 🔹 Try to find source blog */
  if (mongoose.Types.ObjectId.isValid(blogId)) {
    sourceBlog = await Blog.findOne({
      _id: blogId,
      isPublished: true,
    });
  }

  
  

  const sourceCategory = normalizeCategory(
    category || sourceBlog?.category || "",
  );

  

  /* 🔹 Fetch candidates */
  const candidates = await Blog.find({
    isPublished: true,
    ...(sourceBlog ? { _id: { $ne: blogId } } : {}),
  });

 

  if (!candidates.length) return [];

  /* 🔹 TF-IDF only if source blog exists */
  let tfidf, sourceVector;

  if (sourceBlog) {
    tfidf = new TfIdf();

    tfidf.addDocument(
      preprocessText(
        `${sourceBlog.title} ${sourceBlog.excerpt} ${sourceBlog.content}`,
      ),
    );

    candidates.forEach((b) =>
      tfidf.addDocument(preprocessText(`${b.title} ${b.excerpt} ${b.content}`)),
    );

    sourceVector = getVector(tfidf, 0);
  }

  /* 🔹 Final scoring */
  const scored = candidates.map((blog, i) => {
    const contentScore = sourceVector
      ? cosineSimilarity(sourceVector, getVector(tfidf, i + 1))
      : 0;

    const catScore = getCategoryScore(
      sourceCategory,
      normalizeCategory(blog.category),
    );

    const finalScore = contentWeight * contentScore + categoryWeight * catScore;

    

    return {
      blogId: blog._id.toString(),
      title: blog.title,
      finalScore,
    };
  });

  

  return scored
    .filter((b) => b.finalScore >= minScore)
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);
};

export default { getRecommendations };
