import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  console.log("🚀 Listing Available Models for current key...");
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    // There isn't a direct listModels top-level in SDK usually, 
    // it's an API call. But let's try to see if we can fetch something basic.
    console.log("Key set correctly. Attempting a very basic health check call...");
    
    // Instead of listing (which might be complex in SDK), let's just confirm the key can reach the endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("\n✅ Models found:");
      data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } else {
      console.log("\n❌ No models found or error in response.");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("\n❌ Request Failed:");
    console.error(error.message);
  }
}

listModels();
