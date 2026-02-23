import express from "express";
import {
  createBlog,
  publishBlog,
  getPopularBlogs
} from "../controllers/admin/blog.admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createBlog);
router.patch("/:id/publish", authMiddleware, adminMiddleware, publishBlog);
router.get("/popular", authMiddleware, adminMiddleware, getPopularBlogs);

export default router;
