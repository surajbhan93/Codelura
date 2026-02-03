import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileName: String,
    filePath: String,
    fileSize: Number,
    fileType: {
      type: String, // pdf | excel | image | zip | other
      enum: ["pdf", "excel", "image", "zip", "other"]
    }
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    /* =====================
       BASIC INFO
    ===================== */
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    slug: {
      type: String,
      unique: true
    },

    category: {
      type: String,
      enum: ["course", "notes"],
      default: "notes"
    },

    /* =====================
       MEDIA
    ===================== */

    // 🔥 Banner / Thumbnail image
    bannerImage: {
      fileName: String,
      filePath: String,
      fileSize: Number
    },

    // 🔥 Main PDF (notes / material)
    pdf: {
      fileName: String,
      filePath: String,
      fileSize: Number
    },

    // 🔥 Additional files (Excel, ZIP, etc.)
    attachments: [fileSchema],

    /* =====================
       LINKS (Topmate / External)
    ===================== */

    externalLinks: [
      {
        title: String, // e.g. "1:1 Mentorship"
        url: String,   // e.g. https://topmate.io/xyz
        type: {
          type: String,
          enum: ["topmate", "zoom", "drive", "youtube", "other"],
          default: "other"
        }
      }
    ],

    /* =====================
       PRICING
    ===================== */

    price: {
      type: Number,
      default: 0 // 0 = free
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    validityDays: {
      type: Number // e.g. 30, 90, 365
    },

    /* =====================
       PREVIEW & ACCESS
    ===================== */

    previewPages: {
      type: Number,
      default: 2
    },

    /* =====================
       META / FILTERING
    ===================== */

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },

    language: {
      type: String,
      default: "Hindi"
    },

    tags: [
      {
        type: String // e.g. ["maths", "btech", "gate"]
      }
    ],

    duration: {
      type: String // e.g. "6 hours", "3 weeks"
    },

    /* =====================
       ADMIN & STATUS
    ===================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    isPublished: {
      type: Boolean,
      default: true
    },

    rating: {
      type: Number,
      default: 0
    },

    totalPurchases: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
