const extractKeyword = require("../utils/keywordExtractor");

module.exports = function validate(output, content) {
  if (!output.metaTitle || !output.metaDescription) return false;

  if (output.metaTitle.length < 50 || output.metaTitle.length > 60) return false;
  if (output.metaDescription.length < 140 || output.metaDescription.length > 160) return false;

  const keyword = extractKeyword(content).toLowerCase();
  if (!output.metaTitle.toLowerCase().includes(keyword)) return false;

  return true;
};