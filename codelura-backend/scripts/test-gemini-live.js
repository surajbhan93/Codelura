import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Direct Live Test
 */
async function testLiveKey() {
  console.log("🚀 Testing Live Gemini AI Generation...");
  const key = process.env.GEMINI_API_KEY;
  console.log("Key:", key ? (key.slice(0, 5) + "..." + key.slice(-5)) : "Missing");

  if (!key) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    // Trying gemini-2.0-flash (verified as available for this key)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log("Attempting to generate content with gemini-2.0-flash...");
    const result = await model.generateContent("Hello, respond with 'Verification Successful' if you see this.");
    const response = await result.response;
    console.log("\n✨ Result:\n", response.text().trim());
    console.log("\n✅ Success! Gemini is working perfectly with this key.");
  } catch (error) {
    console.error("\n❌ Live Test Failed:");
    console.error("Error Message:", error.message);
    if (error.status) console.error("Status Code:", error.status);
    
    console.log("\n💡 Possible reasons:");
    console.log("- The API key is invalid or for a different project.");
    console.log("- The 'Generative Language API' is not enabled for this project.");
    console.log("- Your account has reached its quota or has billing issues.");
  }
}

testLiveKey();
