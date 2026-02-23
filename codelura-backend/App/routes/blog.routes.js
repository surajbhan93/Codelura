import express from "express";
import {
  getAllBlogs,
  getBlogBySlug,
  likeBlog
} from "../controllers/web/blog.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ BLOG LIST
router.get("/", getAllBlogs);

// BLOG DETAIL
router.get("/:slug", getBlogBySlug);

// LIKE / UNLIKE
router.post("/:id/like", authMiddleware, likeBlog);

export default router;
