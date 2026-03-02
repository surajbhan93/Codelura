import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    // Don't exit - server continues without MongoDB
    console.log("⚠️ Running without MongoDB - using in-memory storage");
  }
};

export default connectDB;