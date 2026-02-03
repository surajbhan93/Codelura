import Course from "../../models/Course.js";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import path from "path";
/**
 * ===============================
 * LIST COURSES
 * ===============================
 */
export const listCourses = async (req, res) => {
  const courses = await Course.find({ isPublished: true })
    .select("-pdf.filePath -attachments.filePath")
    .sort({ createdAt: -1 });

  res.json(courses);
};

/**
 * ===============================
 * COURSE DETAIL
 * ===============================
 */
export const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Not found" });
  }

  const canAccess =
    !course.isPaid ||
    req.user?.purchasedCourses?.includes(course._id);

  res.json({ course, canAccess });
};

/**
 * ===============================
 * PREVIEW PDF (FIRST N PAGES)
 * ===============================
 * GET /api/courses/:id/preview
 */
export const previewPDF = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || !course.pdf?.filePath) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const pdfPath = course.pdf.filePath;
    const previewPages = course.previewPages || 2;

    const originalBytes = fs.readFileSync(pdfPath);
    const originalPdf = await PDFDocument.load(originalBytes);

    const totalPages = originalPdf.getPageCount();

    // 🔥 create preview pdf
    const previewPdf = await PDFDocument.create();

    const pagesToCopy = Math.min(previewPages, totalPages);
    const copiedPages = await previewPdf.copyPages(
      originalPdf,
      Array.from({ length: pagesToCopy }, (_, i) => i)
    );

    copiedPages.forEach((p) => previewPdf.addPage(p));

    const previewBytes = await previewPdf.save();

    // 🔥 IMPORTANT HEADERS
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=preview.pdf");

    // 👇 send total pages info
    res.setHeader("X-Total-Pages", totalPages);
    res.setHeader("X-Preview-Pages", pagesToCopy);

    return res.end(Buffer.from(previewBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Preview failed" });
  }
};
/**
 * ===============================
 * FULL PDF (PAID)
 * ===============================
 */
export const downloadPDF = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.sendStatus(404);

  if (
    course.isPaid &&
    !req.user.purchasedCourses.includes(course._id)
  ) {
    return res
      .status(403)
      .json({ message: "Purchase required" });
  }

  res.sendFile(course.pdf.filePath);
};
