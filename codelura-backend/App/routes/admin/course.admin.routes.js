// import express from "express";
// import {
//   uploadCourse,
//   deleteCourse,
//   togglePublishCourse
// } from "../../controllers/admin/course.admin.controller.js";
// import { authMiddleware } from "../../middleware/auth.middleware.js";
// import { adminOnly } from "../../middleware/adminOnly.js";
// import { uploadPDF } from "../../utils/uploadPDF.js";

// const router = express.Router();

// router.post(
//   "/courses",
//   authMiddleware,
//   adminOnly,
//   uploadPDF.single("pdf"),
//   uploadCourse
// );

// router.delete(
//   "/courses/:id",
//   authMiddleware,
//   adminOnly,
//   deleteCourse
// );

// router.patch(
//   "/courses/:id/publish",
//   authMiddleware,
//   adminOnly,
//   togglePublishCourse
// );

// export default router;

import express from "express";
import {
  uploadCourse,
  deleteCourse,
  togglePublishCourse
} from "../../controllers/admin/course.admin.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/adminOnly.js";

import { upload } from "../../utils/uploadPDF.js";

const router = express.Router();

router.post(
  "/courses",
  authMiddleware,
  adminOnly,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "attachments", maxCount: 5 }
  ]),
  uploadCourse
);

router.delete(
  "/courses/:id",
  authMiddleware,
  adminOnly,
  deleteCourse
);

router.patch(
  "/courses/:id/publish",
  authMiddleware,
  adminOnly,
  togglePublishCourse
);

export default router;
