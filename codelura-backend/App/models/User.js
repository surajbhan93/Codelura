import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    // 🔐 Email verification
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifyToken: String,

    // 🔐 Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // 💳 PAID COURSES / NOTES (NEW)
    purchasedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  { timestamps: true }
);

/**
 * ⚠️ IMPORTANT
 * - DO NOT use arrow function
 * - DO NOT change function signature
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

export default mongoose.model("User", userSchema);

