import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: String,

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },

    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
