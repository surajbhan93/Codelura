import axios from "axios";

const BASE_URL = "http://localhost:3000/api/ai";

const longBlogText = `
Artificial Intelligence (AI) has rapidly transformed from a futuristic concept into an integral part of our daily lives. From the voice assistants on our smartphones to the sophisticated algorithms that power our social media feeds, AI is everywhere. One of the most significant areas where AI is making an impact is in the field of healthcare. Machine learning models are now being used to analyze medical images with incredible precision, often outperforming human radiologists in detecting early signs of diseases like cancer.

Furthermore, AI is revolutionizing the way we approach education. Adaptive learning platforms use AI to tailor educational content to the individual needs of each student, ensuring that they receive the right level of challenge and support. This personalized approach has the potential to significantly improve learning outcomes and make education more accessible to people around the world.

In the business world, AI is being used to optimize supply chains, predict consumer behavior, and automate repetitive tasks. This allows companies to operate more efficiently and make data-driven decisions that can lead to increased profitability and growth. However, the rise of AI also brings with it significant ethical considerations. Concerns about data privacy, algorithmic bias, and the impact of automation on the job market are all topics of ongoing debate.

As we continue to develop and integrate AI into our society, it is crucial that we do so in a way that is ethical, transparent, and beneficial to all of humanity. This requires collaboration between researchers, policymakers, and the public to ensure that AI is used responsibly and for the greater good. The future of AI is full of possibilities, and by working together, we can harness its power to build a better world for everyone.
`;

const shortBlogText = "This is a short blog post that should fail the word count validation.";

async function runTests() {
  console.log("🚀 Starting AI Blog Summary Tests...\n");

  // Test 1: Validation Check (Short Content)
  try {
    console.log("🧪 Test 1: Validation Check (Short Content)");
    const res = await axios.post(`${BASE_URL}/blog-summary`, { content: shortBlogText });
    console.log("❌ Test 1 Failed: Should have returned 400");
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log("✅ Test 1 Passed: Correctly returned 400 for short content");
    } else {
      console.log("❌ Test 1 Failed:", error.message);
    }
  }

  // Test 2: Summary Generation (Long Content - Fallback if no API key)
  try {
    console.log("\n🧪 Test 2: Summary Generation (Long Content)");
    const res = await axios.post(`${BASE_URL}/blog-summary`, { content: longBlogText });
    console.log("✅ Test 2 Passed: Summary generated!");
    console.log("Summary:", res.data.summary);
  } catch (error) {
    console.log("❌ Test 2 Failed:", error.message);
    if (error.response) console.log("Response:", error.response.data);
  }

  console.log("\n🏁 Tests Completed!");
}

runTests();
