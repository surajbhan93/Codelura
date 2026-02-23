import RuleEngine from "./RuleEngine.js";
import HackathonAIService from "./HackathonAIService.js";
import Evaluation from "../models/Evaluation.js";

class ScoringService {
  /**
   * Orchestrates the scoring process for a hackathon submission.
   * @param {Object} submission - Submission details
   * @param {boolean} force - Whether to bypass cache
   * @returns {Promise<Object>} Final evaluation result
   */
  static async processSubmission(submission, force = false) {
    const { submissionId, hackathonId } = submission;

    // 1. Cache Check
    if (!force) {
      const cached = await Evaluation.findOne({ submissionId });
      if (cached) {
        return cached;
      }
    }

    // 2. Rule Engine (MANDATORY)
    const ruleResult = RuleEngine.evaluate(submission);
    const { ruleScore, breakdown } = ruleResult;

    let finalScore = ruleScore;
    let evaluationType = "RULE_BASED";
    let remarks = ruleResult.breakdown.isCapped 
      ? "Clear implementation but lacks GitHub repository link (score capped)."
      : "Automated rule-based evaluation completed.";
    let aiScores = null;

    // 3. AI Eligibility Check
    // AI may run only if:
    // 5 <= rule_score <= 7 AND githubLink present AND not flagged as spam (simulated)
    const isAiEligible = 
      ruleScore >= 5 && 
      ruleScore <= 7 && 
      submission.githubLink && 
      submission.githubLink.trim() !== "";

    if (isAiEligible) {
      try {
        // 4. AI Evaluation
        aiScores = await HackathonAIService.evaluate(submission);
        
        const aiAverage = (aiScores.innovation_score + aiScores.feasibility_score + aiScores.impact_score) / 3;
        
        // 5. Score Merge
        // final_score = (0.7 * rule_score) + (0.3 * ai_average)
        finalScore = (0.7 * ruleScore) + (0.3 * aiAverage);
        finalScore = parseFloat(finalScore.toFixed(1));
        evaluationType = "AI_ENHANCED";
        remarks = aiScores.remarks;
      } catch (error) {
        console.error("AI Evaluation failed, falling back to rule score:", error.message);
        // Fallback: final_score = rule_score (already set)
      }
    }

    // 6. Persist Result
    const evaluationData = {
      ruleScore,
      finalScore,
      evaluationType,
      remarks,
      details: {
        ruleBreakdown: breakdown,
        aiScores,
      },
      evaluatedAt: new Date(),
    };

    const evaluation = await Evaluation.findOneAndUpdate(
      { submissionId },
      { ...evaluationData, hackathonId },
      { upsert: true, new: true }
    );

    return evaluation;
  }
}

export default ScoringService;
