import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes imports
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminBlogRoutes from "./routes/admin.blog.routes.js";
import authRoutes from "./routes/authRoutes.js";
import adminCourseRoutes from "./routes/admin/course.admin.routes.js";
import courseRoutes from "./routes/web/course.routes.js";
import aiRoutes from "./routes/web/ai.routes.js"; // ✅ AI ROUTE

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://10.100.125.51:3001"
    ],
    credentials: true
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/home", (req, res) => {
  res.send("Hello Home page");
});

// 🤖 AI ROUTES
app.use("/ai", aiRoutes); 

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/admin", adminCourseRoutes);
app.use("/api", courseRoutes);

export default app;