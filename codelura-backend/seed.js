import mongoose from "mongoose";
import Blog from "./App/models/Blog.js";

const seedBlogs = async () => {
  try {
   await mongoose.connect("mongodb://127.0.0.1:27017/codelura", {
  serverSelectionTimeoutMS: 30000,
});
    
    console.log("📦 Connected to MongoDB...");

    const sampleBlogs = [
      {
        title: "Complete Guide to Learn React",
        slug: "complete-guide-learn-react",
        excerpt: "Master React from basics to advanced concepts",
        content: "React is a powerful JavaScript library for building user interfaces. Learn components, hooks, state management, and best practices.",
        tags: ["react", "javascript", "frontend", "web-development"],
        category: "Frontend Development",
        authorName: "Admin",
        isPublished: true,
        publishedAt: new Date(),
        readingTime: "8 min read"
      },
      {
        title: "Node.js Backend Development Essentials",
        slug: "nodejs-backend-essentials",
        excerpt: "Build powerful backend APIs with Node.js",
        content: "Node.js tutorial covering Express.js, REST APIs, MongoDB integration, authentication, and deployment.",
        tags: ["nodejs", "express", "backend", "javascript"],
        category: "Backend Development",
        authorName: "Admin",
        isPublished: true,
        publishedAt: new Date(),
        readingTime: "12 min read"
      },
      {
        title: "CSS Flexbox Complete Tutorial",
        slug: "css-flexbox-tutorial",
        excerpt: "Master responsive layouts with Flexbox",
        content: "Learn CSS Flexbox layout module for creating flexible and responsive web designs easily.",
        tags: ["css", "flexbox", "frontend", "web-design"],
        category: "CSS & Design",
        authorName: "Admin",
        isPublished: true,
        publishedAt: new Date(),
        readingTime: "6 min read"
      },
      {
        title: "JavaScript ES6 Features",
        slug: "javascript-es6-features",
        excerpt: "Modern JavaScript features explained",
        content: "ES6 features including arrow functions, destructuring, spread operators, template literals, and more.",
        tags: ["javascript", "es6", "programming"],
        category: "JavaScript",
        authorName: "Admin",
        isPublished: true,
        publishedAt: new Date(),
        readingTime: "10 min read"
      },
      {
        title: "MongoDB Database Design",
        slug: "mongodb-database-design",
        excerpt: "Design efficient NoSQL databases",
        content: "MongoDB schema design, indexing strategies, query optimization, and data modeling patterns.",
        tags: ["mongodb", "database", "nosql", "backend"],
        category: "Database",
        authorName: "Admin",
        isPublished: true,
        publishedAt: new Date(),
        readingTime: "15 min read"
      }
    ];

    await Blog.insertMany(sampleBlogs);
    
    console.log("✅ Added 5 sample blogs!");
    console.log("🔍 Test queries: 'how to learn react', 'css layouts'");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedBlogs();