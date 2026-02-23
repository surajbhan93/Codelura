const natural = require("natural");
const TfIdf = natural.TfIdf;

module.exports = function extractKeyword(text) {
  const tfidf = new TfIdf();
  tfidf.addDocument(text);

  const terms = tfidf.listTerms(0);
  return terms.length ? terms[0].term : "guide";
};