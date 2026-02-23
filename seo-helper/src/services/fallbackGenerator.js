const extractKeyword = require("../utils/keywordExtractor");

module.exports = (title, content) => {
  const keyword = extractKeyword(content);

  const metaTitle = `${keyword} – Complete Guide`.slice(0,60);

  const firstSentences = content.split(". ").slice(0,2).join(". ");
  const metaDescription = firstSentences.slice(0,160);

  const headings = [
    `${title}`,
    `What is ${keyword}?`,
    `Benefits of ${keyword}`,
    `How to use ${keyword}`
  ];

  return { metaTitle, metaDescription, headings };
};