import natural from "natural";

// Mock Fallback Logic from ai.service.js
const fallbackSummary = (content) => {
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(content);

  if (sentences.length <= 3) return sentences.join(" ");

  const tfidf = new natural.TfIdf();
  sentences.forEach((sentence) => tfidf.addDocument(sentence));

  const rankedSentences = sentences.map((sentence, index) => {
    let score = 0;
    const words = sentence.toLowerCase().match(/\w+/g) || [];
    words.forEach((word) => {
      tfidf.tfidfs(word, (docIndex, tfidfScore) => {
        if (docIndex === index) score += tfidfScore;
      });
    });
    return { sentence, score, index };
  });

  const topSentences = rankedSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return topSentences
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence)
    .join(" ");
};

const longBlogText = `
Artificial Intelligence (AI) has rapidly transformed from a futuristic concept into an integral part of our daily lives. From the voice assistants on our smartphones to the sophisticated algorithms that power our social media feeds, AI is everywhere. One of the most significant areas where AI is making an impact is in the field of healthcare. Machine learning models are now being used to analyze medical images with incredible precision, often outperforming human radiologists in detecting early signs of diseases like cancer.

Furthermore, AI is revolutionizing the way we approach education. Adaptive learning platforms use AI to tailor educational content to the individual needs of each student, ensuring that they receive the right level of challenge and support. This personalized approach has the potential to significantly improve learning outcomes and make education more accessible to people around the world.

In the business world, AI is being used to optimize supply chains, predict consumer behavior, and automate repetitive tasks. This allows companies to operate more efficiently and make data-driven decisions that can lead to increased profitability and growth. However, the rise of AI also brings with it significant ethical considerations. Concerns about data privacy, algorithmic bias, and the impact of automation on the job market are all topics of ongoing debate.

As we continue to develop and integrate AI into our society, it is crucial that we do so in a way that is ethical, transparent, and beneficial to all of humanity. This requires collaboration between researchers, policymakers, and the public to ensure that AI is used responsibly and for the greater good. The future of AI is full of possibilities, and by working together, we can harness its power to build a better world for everyone.
`;

console.log("🧪 Testing Fallback Summary Logic...");
const summary = fallbackSummary(longBlogText);
console.log("\nGenerated Summary (3 key sentences):\n");
console.log(summary);

const sentences = summary.split(/[.!?]/).filter(s => s.trim().length > 0);
if (sentences.length <= 3) {
  console.log("\n✅ Verification Passed: Summary is within 3 sentences (as per fallback rule).");
} else {
  console.log("\n❌ Verification Failed: Summary too long.");
}

const wordCount = longBlogText.trim().split(/\s+/).length;
console.log(`\nWord Count: ${wordCount}`);
if (wordCount >= 200) {
  console.log("✅ Verification Passed: Validation logic (200 words) would pass.");
}
