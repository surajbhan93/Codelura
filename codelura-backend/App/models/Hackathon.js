import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    prizePool: {
      type: String,
      required: true,
    },
    prizeDetails: {
      type: String,
      required: true,
    },
    rules: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    registrationDeadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for participantsCount
hackathonSchema.virtual("participantsCount").get(function () {
  return this.participants ? this.participants.length : 0;
});

// Virtual for registrationClosed
hackathonSchema.virtual("registrationClosed").get(function () {
  return new Date() > this.registrationDeadline;
});

// TODO: Refactor to a separate Participation model for better performance and scalability.
// For now, ensuring database-level integrity via a unique compound index is not possible 
// with a simple array of ObjectIds. In a real production system, we would use:
// const participationSchema = new Schema({ userId: ObjectId, hackathonId: ObjectId });
// participationSchema.index({ userId: 1, hackathonId: 1 }, { unique: true });

export default mongoose.model("Hackathon", hackathonSchema);
