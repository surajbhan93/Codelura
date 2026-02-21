import natural from "natural";
import { removeStopwords } from "stopword";
import Blog from "../../models/Blog.js";

const TfIdf = natural.TfIdf;

// const preprocessText = (text) => {
//   if (!text) return "";
//   return removeStopwords(
//     text
//       .toLowerCase()
//       .replace(/[^a-z\s]/g, " ")
//       .replace(/\s+/g, " ")
//       .trim()
//       .split(" "),
//   ).join(" ");
// };

const synonymMap = {
  authentication: "auth",
  authenticate: "auth",
  node: "nodejs",
  js: "nodejs",
  // add new ones here:
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
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  words = words.map((w) => synonymMap[w] || w);

  return removeStopwords(words).join(" ");
};
const cosineSimilarity = (vecA, vecB) => {
  const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  allTerms.forEach((term) => {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  });

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

const getVector = (tfidf, index) => {
  const vector = {};
  tfidf.listTerms(index).forEach(({ term, tfidf: score }) => {
    vector[term] = score;
  });
  return vector;
};

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    const blogs = await Blog.find({ isPublished: true }).select(
      "_id title content excerpt tags",
    );

    if (blogs.length === 0) {
      return res.json({ results: [] });
    }

    const tfidf = new TfIdf();

    blogs.forEach((blog) => {
      const text = preprocessText(
        `${blog.title} ${blog.excerpt || ""} ${blog.content || ""} ${(
          blog.tags || []
        ).join(" ")}`,
      );
      //   debug errors
      console.log("BLOG TEXT:", blog.title, "=>", text);
      tfidf.addDocument(text);
    });

    const cleanQuery = preprocessText(query);
    tfidf.addDocument(cleanQuery);
    const queryIndex = blogs.length;
    console.log("QUERY TEXT:", cleanQuery);
    const queryVector = getVector(tfidf, queryIndex);

    const results = blogs
      .map((blog, i) => {
        const blogVector = getVector(tfidf, i);
        const score = cosineSimilarity(queryVector, blogVector);
        return {
          blogId: blog._id.toString(),
          title: blog.title,
          score: parseFloat(score.toFixed(2)),
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
