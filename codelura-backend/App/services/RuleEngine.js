/**
 * Rule-Based Scoring Engine (MANDATORY)
 * Implements deterministic scoring logic for hackathon submissions.
 */
class RuleEngine {
  static BASE_SCORE = 6;

  static BACKEND_KEYWORDS = ["node", "django", "flask", "spring", "rails", "express"];
  static FRONTEND_KEYWORDS = ["react", "vue", "angular", "next", "html", "css"];

  static GENERIC_PHRASES = [
    "revolutionary",
    "scalable solution",
    "user-friendly",
    "innovative platform"
  ];

  static TECHNICAL_KEYWORDS = [
    "api", "database", "endpoint", "architecture", "microservice", 
    "schema", "middleware", "authentication", "deployment"
  ];

  /**
   * Evaluates a submission based on predefined rules.
   * @param {Object} submission - Input data
   * @returns {Object} { ruleScore, breakdown }
   */
  static evaluate(submission) {
    const { projectDescription, techStack, githubLink } = submission;

    let score = this.BASE_SCORE;
    const breakdown = {
      descriptionScore: 0,
      techStackScore: 0,
      contentQualityScore: 0,
      isCapped: false,
    };

    // 5.1 Description Quality
    const wordCount = (projectDescription || "").split(/\s+/).filter(Boolean).length;
    if (wordCount < 120) {
      breakdown.descriptionScore = -2;
    } else if (wordCount > 250) {
      breakdown.descriptionScore = 1;
    }
    score += breakdown.descriptionScore;

    // 5.2 Tech Stack Completeness
    if (!techStack || techStack.length === 0) {
      breakdown.techStackScore = -2;
    } else {
      const stackStr = techStack.join(" ").toLowerCase();
      const hasBackend = this.BACKEND_KEYWORDS.some(kw => stackStr.includes(kw));
      const hasFrontend = this.FRONTEND_KEYWORDS.some(kw => stackStr.includes(kw));

      if (hasBackend && hasFrontend) {
        breakdown.techStackScore = 1;
      } else if (!hasBackend && !hasFrontend) {
        // 1-2 generic tools -> 0 (covered by default)
      }
    }
    score += breakdown.techStackScore;

    // 5.4 Generic Content Detection
    const descLower = (projectDescription || "").toLowerCase();
    const hasGeneric = this.GENERIC_PHRASES.some(phrase => descLower.includes(phrase));
    const hasTechnical = this.TECHNICAL_KEYWORDS.some(kw => descLower.includes(kw));

    if (hasGeneric && !hasTechnical) {
      breakdown.contentQualityScore = -1;
    } else if (hasTechnical) {
      breakdown.contentQualityScore = 1;
    }
    score += breakdown.contentQualityScore;

    // Clamp score [0, 10]
    let ruleScore = Math.max(0, Math.min(10, score));

    // 5.3 GitHub Presence Rule (Max Cap)
    if (!githubLink || githubLink.trim() === "") {
      if (ruleScore > 6) {
        ruleScore = 6;
        breakdown.isCapped = true;
      }
    }

    return { ruleScore: parseFloat(ruleScore.toFixed(1)), breakdown };
  }
}

export default RuleEngine;
