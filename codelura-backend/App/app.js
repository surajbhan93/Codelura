import express from "express";
import cookieParser from "cookie-parser";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminBlogRoutes from "./routes/admin.blog.routes.js";
import authRoutes from "./routes/authRoutes.js";
import adminCourseRoutes from "./routes/admin/course.admin.routes.js";
import courseRoutes from "./routes/web/course.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import cors from "cors";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://10.100.125.51:3001"
    ],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// COOKIE PARSER (YAHAN ADD KARNA HAI)
app.use(cookieParser());
// Test routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/home", (req, res) => {
  res.send("Hello Home page");
});

// API routes
app.use("/api/auth", authRoutes);

app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
// 📚 COURSES / NOTES (NEW)
app.use("/api/admin", adminCourseRoutes);
app.use("/api", courseRoutes);
app.use("/api/ai", aiRoutes);
export default app;
