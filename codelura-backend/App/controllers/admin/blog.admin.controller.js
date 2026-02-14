import Blog from "../../models/Blog.js";
import BlogAnalytics from "../../models/BlogAnalytics.js";
import { generateSlug } from "../../utils/slugify.js";
import { calculateReadingTime } from "../../utils/readingTime.js";
import TurndownService from "turndown";

/**
 * CREATE BLOG (ADVANCED CMS LEVEL)
 */
export const createBlog = async (req, res) => {
    
  try {
    const {
      title,
      slug,
      excerpt,
      content, // HTML from editor

      coverImage,
      ogImage,

      metaTitle,
      metaDescription,

      tags,
      category,
      authorName,

      isFeatured,
      allowComments,
      
      publishNow
    } = req.body;

    // ✅ Basic validation
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    // 🔗 Slug logic (custom or auto)
    const finalSlug = slug
      ? generateSlug(slug)
      : generateSlug(title);

    // 🚫 Prevent duplicate slug
    const slugExists = await Blog.findOne({ slug: finalSlug });
    if (slugExists) {
      return res.status(409).json({
        message: "Slug already exists"
      });
    }

     // 🔁 HTML → Markdown (API level = BEST)
    const turndown = new TurndownService();
    const contentMarkdown = turndown.turndown(content);

    // 🕒 Reading Time logic (Automated)
    const readingTime = calculateReadingTime(contentMarkdown);

    // 🕒 Publish logic
    const isPublished = publishNow === true;
    const publishedAt = isPublished ? new Date() : null;

    // 📝 Create blog
    const blog = await Blog.create({
      title,
      slug: finalSlug,
      excerpt,
      contentHtml: content,
      contentMarkdown,

      coverImage,
      ogImage: ogImage || coverImage,

      metaTitle: metaTitle || title,
      metaDescription,
      canonicalUrl: `https://yourdomain.com/blog/${finalSlug}`,

      tags,
      category,
      authorName,

      isFeatured: isFeatured || false,
      allowComments: allowComments !== false,

      readingTime,

      isPublished,
      publishedAt
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

/**
 * PUBLISH BLOG
 */
export const publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        isPublished: true,
        publishedAt: new Date()
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.json({
      message: "Blog published successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

/**
 * GET POPULAR BLOGS (ANALYTICS)
 */
export const getPopularBlogs = async (req, res) => {
  try {
    const blogs = await BlogAnalytics.aggregate([
      {
        $group: {
          _id: "$blogId",
          views: { $sum: "$views" },
          likes: { $sum: "$likes" },
          comments: { $sum: "$comments" },
          shares: { $sum: "$shares" }
        }
      },
      {
        $addFields: {
          score: {
            $add: [
              "$views",
              { $multiply: ["$likes", 2] },
              { $multiply: ["$comments", 3] },
              { $multiply: ["$shares", 4] }
            ]
          }
        }
      },
      { $sort: { score: -1 } }
    ]);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

/**
 * UPDATE BLOG
 */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔗 If title changes, update slug (unless custom slug provided)
    if (updates.title && !updates.slug && updates.title !== blog.title) {
      updates.slug = generateSlug(updates.title);
    } else if (updates.slug) {
      updates.slug = generateSlug(updates.slug);
    }

    // 🔁 If HTML content changes, update Markdown and Reading Time
    if (updates.content) {
      const turndown = new TurndownService();
      updates.contentMarkdown = turndown.turndown(updates.content);
      updates.readingTime = calculateReadingTime(updates.contentMarkdown);
      // Synchronize contentHtml if it's named content in request
      updates.contentHtml = updates.content;
    }

    // 🕒 Handle publishing
    if (updates.publishNow === true) {
      updates.isPublished = true;
      updates.publishedAt = blog.publishedAt || new Date();
    } else if (updates.publishNow === false) {
      updates.isPublished = false;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      message: "Blog updated successfully",
      blog: updatedBlog
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE BLOG
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🗑️ Clean up analytics
    await BlogAnalytics.deleteMany({ blogId: id });

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

