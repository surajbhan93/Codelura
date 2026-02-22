const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ask(prompt) {
  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4
  });
  return res.choices[0].message.content.trim();
}

module.exports = async (title, content) => {
  const metaTitle = await ask(`Generate an SEO-friendly meta title (max 60 characters)
Guidelines:
- Clear and engaging
- Include main keyword
- No keyword stuffing
Content:
${content}`);

  const metaDescription = await ask(`Write an SEO-optimized meta description (max 160 characters).
Guidelines:
- Clear and engaging
- Include relevant keywords naturally
- Encourage users to click
- No emojis or quotes
Content:
${content}`);

  const headingsRaw = await ask(`Suggest SEO-friendly headings (1 H1 and 2–3 H2).
Guidelines:
- Reflect blog intent
- Clear and readable
- SEO optimized but natural
Content:
${content}`);

  const headings = headingsRaw.split("\n").filter(h => h.trim());

  return { metaTitle, metaDescription, headings };
};