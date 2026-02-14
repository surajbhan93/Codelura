import Blog from "../../models/Blog.js";
import BlogAnalytics from "../../models/BlogAnalytics.js";


/**
 * GET ALL PUBLISHED BLOGS (LIST)
 */
export const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      tag,
      search
    } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    
    // 🔍 Search Logic
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const blogs = await Blog.find(query)
      .select(
        "title slug excerpt coverImage authorName readingTime tags isFeatured createdAt"
      )
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET BLOGS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};


export const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    isPublished: true
  });

  if (!blog) return res.status(404).json({ message: "Blog not found" });

  blog.views += 1;
  await blog.save();

  const today = new Date().setHours(0, 0, 0, 0);

  await BlogAnalytics.findOneAndUpdate(
    { blogId: blog._id, date: today },
    { $inc: { views: 1 } },
    { upsert: true }
  );

  res.json(blog);
};

export const likeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const userId = req.user.id;

  if (blog.likes.includes(userId)) {
    blog.likes.pull(userId);
  } else {
    blog.likes.push(userId);

    const today = new Date().setHours(0, 0, 0, 0);
    await BlogAnalytics.findOneAndUpdate(
      { blogId: blog._id, date: today },
      { $inc: { likes: 1 } },
      { upsert: true }
    );
  }

  blog.likesCount = blog.likes.length;
  await blog.save();

  res.json({ likesCount: blog.likesCount });
};
