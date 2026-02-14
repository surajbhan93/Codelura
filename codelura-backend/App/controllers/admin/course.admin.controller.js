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

/**
 * ===============================
 * ADMIN: UPDATE COURSE
 * ===============================
 * PATCH /api/admin/courses/:id
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔗 Slug logic (only if title changes)
    if (updates.title && updates.title !== course.title) {
      updates.slug = slugify(updates.title, { lower: true });
    }

    // Handle price/isPaid logic
    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
      updates.isPaid = updates.price > 0;
    }

    // File updates (handled in route if new files uploaded)
    if (req.files) {
      if (req.files.pdf) {
        updates.pdf = {
          fileName: req.files.pdf[0].originalname,
          filePath: req.files.pdf[0].path,
          fileSize: req.files.pdf[0].size
        };
      }
      if (req.files.banner) {
        updates.bannerImage = {
          fileName: req.files.banner[0].originalname,
          filePath: req.files.banner[0].path,
          fileSize: req.files.banner[0].size
        };
      }
      if (req.files.attachments) {
        updates.attachments = req.files.attachments.map((f) => ({
          fileName: f.originalname,
          filePath: f.path,
          fileSize: f.size,
          fileType: f.mimetype.includes("excel") ? "excel" : "other"
        }));
      }
    }

    if (updates.externalLinks) {
      updates.externalLinks = typeof updates.externalLinks === 'string' 
        ? JSON.parse(updates.externalLinks) 
        : updates.externalLinks;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      message: "Course updated successfully",
      course: updatedCourse
    });
  } catch (err) {
    console.error("UPDATE ERROR 👉", err);
    res.status(500).json({ message: "Course update failed" });
  }
};

