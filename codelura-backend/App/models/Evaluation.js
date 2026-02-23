import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    submissionId: { type: String, required: true, index: true },
    hackathonId: { type: String, required: true },
    ruleScore: { type: Number, required: true },
    finalScore: { type: Number, required: true },
    evaluationType: {
      type: String,
      enum: ["RULE_BASED", "AI_ENHANCED"],
      default: "RULE_BASED",
    },
    remarks: { type: String },
    details: {
      ruleBreakdown: {
        descriptionScore: Number,
        techStackScore: Number,
        contentQualityScore: Number,
        isCapped: Boolean,
      },
      aiScores: {
        innovation: Number,
        feasibility: Number,
        impact: Number,
      },
    },
    evaluatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure submissionId is unique per hackathon if needed, 
// but for cache purposes, submissionId uniqueness is primary.
evaluationSchema.index({ submissionId: 1 }, { unique: true });

export default mongoose.model("Evaluation", evaluationSchema);
