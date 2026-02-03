import Blog from "../../models/Blog.js";
import BlogAnalytics from "../../models/BlogAnalytics.js";
import { generateSlug } from "../../utils/slugify.js";
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
      readingTime,

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
