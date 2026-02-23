import Comment from "../../models/Comment.js";
import BlogAnalytics from "../../models/BlogAnalytics.js";

export const addComment = async (req, res) => {
  const comment = await Comment.create({
    blogId: req.body.blogId,
    userId: req.user.id,
    comment: req.body.comment,
    parentCommentId: req.body.parentCommentId || null
  });

  const today = new Date().setHours(0, 0, 0, 0);
  await BlogAnalytics.findOneAndUpdate(
    { blogId: req.body.blogId, date: today },
    { $inc: { comments: 1 } },
    { upsert: true }
  );

  res.status(201).json(comment);
};
