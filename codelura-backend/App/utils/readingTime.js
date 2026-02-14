/**
 * Calculates reading time based on word count.
 * Average reading speed: 200-250 words per minute.
 * @param {string} content - The blog content.
 * @returns {string} - Formatted reading time (e.g., "5 min read").
 */
export const calculateReadingTime = (content) => {
  if (!content) return "0 min read";
  
  const words = content.trim().split(/\s+/).length;
  const wpm = 225; // Average speed
  const minutes = Math.ceil(words / wpm);
  
  return `${minutes} min read`;
};
