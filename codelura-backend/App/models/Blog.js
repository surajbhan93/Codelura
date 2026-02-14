import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String, // short description
    content: String,
    // MEDIA
    coverImage: String,
    ogImage: String,
    // SEO
    metaTitle: String,
    metaDescription: String,
    canonicalUrl: String,
   
     // ORGANIZATION
    tags: [String],
    category: String,
    authorName: String,

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },

    views: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },

    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },
     // TIME
    readingTime: String,
    publishedAt: Date,
    summary: String // AI generated summary
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
