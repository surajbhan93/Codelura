import express from "express";
import { addComment } from "../controllers/web/comment.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addComment);

export default router;
