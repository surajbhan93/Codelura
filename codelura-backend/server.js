import dotenv from "dotenv";
import app from "./App/app.js";
import connectDB from "./App/config/db.js";
import cors from "cors";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
