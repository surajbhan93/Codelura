import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "../App/models/Blog.js";

dotenv.config();

const BASE_URL = "http://localhost:3000/api/ai";

const longBlogText = `
Artificial Intelligence (AI) has rapidly transformed from a futuristic concept into an integral part of our daily lives. From the voice assistants on our smartphones to the sophisticated algorithms that power our social media feeds, AI is everywhere. One of the most significant areas where AI is making an impact is in the field of healthcare. Machine learning models are now being used to analyze medical images with incredible precision, often outperforming human radiologists in detecting early signs of diseases like cancer.

Furthermore, AI is revolutionizing the way we approach education. Adaptive learning platforms use AI to tailor educational content to the individual needs of each student, ensuring that they receive the right level of challenge and support. This personalized approach has the potential to significantly improve learning outcomes and make education more accessible to people around the world.

In the business world, AI is being used to optimize supply chains, predict consumer behavior, and automate repetitive tasks. This allows companies to operate more efficiently and make data-driven decisions that can lead to increased profitability and growth. However, the rise of AI also brings with it significant ethical considerations. Concerns about data privacy, algorithmic bias, and the impact of automation on the job market are all topics of ongoing debate.

As we continue to develop and integrate AI into our society, it is crucial that we do so in a way that is ethical, transparent, and beneficial to all of humanity. This requires collaboration between researchers, policymakers, and the public to ensure that AI is used responsibly and for the greater good. The future of AI is full of possibilities, and by working together, we can harness its power to build a better world for everyone.
`;

async function runCacheTest() {
  console.log("🚀 Starting Cache Verification Test...\n");

  try {
    // 1. Connect to MongoDB to create a dummy blog
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const dummyBlog = await Blog.create({
      title: "Cache Test Blog",
      content: longBlogText,
      slug: "cache-test-blog-" + Date.now(),
      isPublished: true
    });
    console.log(`Created dummy blog with ID: ${dummyBlog._id}`);

    // 2. Request summary for the first time
    console.log("\n🧪 Step 1: Requesting summary for the first time...");
    const res1 = await axios.post(`${BASE_URL}/blog-summary`, { 
      content: longBlogText, 
      blogId: dummyBlog._id 
    });
    const summary1 = res1.data.summary;
    console.log("Summary 1:", summary1);

    // 3. Verify it's saved in DB
    const blogAfter = await Blog.findById(dummyBlog._id);
    if (blogAfter.summary === summary1) {
      console.log("✅ Verified: Summary saved in database.");
    } else {
      console.log("❌ Error: Summary NOT saved in database.");
    }

    // 4. Request summary again (should be cached)
    console.log("\n🧪 Step 2: Requesting summary again (should be cached)...");
    const res2 = await axios.post(`${BASE_URL}/blog-summary`, { 
      content: "This content is different, but blogId is same. Should return cached summary.", 
      blogId: dummyBlog._id 
    });
    if (res2.data.summary === summary1) {
      console.log("✅ Verified: Cached summary returned.");
    } else {
      console.log("❌ Error: Cache missed or returned different summary.");
    }

    // 5. Cleanup
    await Blog.findByIdAndDelete(dummyBlog._id);
    console.log("\nCleanup: Dummy blog deleted.");

  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

runCacheTest();
