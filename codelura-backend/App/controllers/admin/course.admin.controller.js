import Course from "../../models/Course.js";
import slugify from "slugify";

/**
 * ===============================
 * ADMIN: CREATE COURSE
 * ===============================
 * POST /api/admin/courses
 */
export const uploadCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price = 0,
      category = "notes",
      level,
      language,
      tags,
      duration,
      validityDays,
      previewPages,
      externalLinks
    } = req.body;

    if (!title || !req.files?.pdf) {
      return res
        .status(400)
        .json({ message: "Title and PDF required" });
    }

    const course = await Course.create({
      title,
      description,
      slug: slugify(title, { lower: true }),
      category,
      price: Number(price),
      isPaid: Number(price) > 0,
      validityDays,
      previewPages: previewPages || 2,
      level,
      language,
      duration,
      tags: tags ? tags.split(",") : [],

      pdf: {
        fileName: req.files.pdf[0].originalname,
        filePath: req.files.pdf[0].path,
        fileSize: req.files.pdf[0].size
      },

      bannerImage: req.files.banner
        ? {
            fileName: req.files.banner[0].originalname,
            filePath: req.files.banner[0].path,
            fileSize: req.files.banner[0].size
          }
        : undefined,

      attachments: req.files.attachments
        ? req.files.attachments.map((f) => ({
            fileName: f.originalname,
            filePath: f.path,
            fileSize: f.size,
            fileType: f.mimetype.includes("excel")
              ? "excel"
              : "other"
          }))
        : [],

      externalLinks: externalLinks
        ? JSON.parse(externalLinks)
        : [],

      createdBy: req.user.id,
      isPublished: true
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (err) {
    console.error("UPLOAD ERROR 👉", err);
    res.status(500).json({ message: "Course creation failed" });
  }
};

/**
 * ===============================
 * ADMIN: DELETE COURSE
 * ===============================
 */
export const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  await course.deleteOne();
  res.json({ message: "Course deleted successfully" });
};

/**
 * ===============================
 * ADMIN: PUBLISH / UNPUBLISH
 * ===============================
 */
export const togglePublishCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.isPublished = !course.isPublished;
  await course.save();

  res.json({
    message: course.isPublished
      ? "Course published"
      : "Course unpublished",
    isPublished: course.isPublished
  });
};
