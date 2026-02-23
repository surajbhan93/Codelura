import express from "express";
import {
  listCourses,
  getCourse,
  previewPDF,
  downloadPDF
} from "../../controllers/web/course.controller.js";

import {
  authMiddleware,
  authOptional
} from "../../middleware/auth.middleware.js";

const router = express.Router();

// 📚 Course list
router.get("/courses", listCourses);

// 📄 Course detail
router.get("/courses/:id", authOptional, getCourse);

// 👁️ Free preview (first N pages)
router.get("/courses/:id/preview", previewPDF);

// 🔒 Full PDF (paid users only)
router.get(
  "/courses/:id/pdf",
  authMiddleware,
  downloadPDF
);

export default router;
