import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  date: Date,

  views: { type: Number, default: 0 },
  uniqueViews: { type: Number, default: 0 },

  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
});

analyticsSchema.index({ blogId: 1, date: 1 }, { unique: true });

export default mongoose.model("BlogAnalytics", analyticsSchema);
