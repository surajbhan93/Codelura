import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("⚠️ No MONGO_URI found. Running in MOCK mode.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed, but continuing in MOCK mode:", error.message);
  }
};

export default connectDB;
