const express = require("express");
const router = express.Router();

const generateAI = require("../services/aiGenerator");
const fallback = require("../services/fallbackGenerator");
const validate = require("../services/validator");

router.post("/seo-helper", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content)
    return res.status(400).json({ error: "Missing input" });

  try {
    const aiResult = await generateAI(title, content);

    if (!validate(aiResult, content))
      return res.json(fallback(title, content));

    res.json(aiResult);
  } catch (err) {
    res.json(fallback(title, content));
  }
});

module.exports = router;