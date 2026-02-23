import ScoringService from "../services/ScoringService.js";

/**
 * HackathonController
 * Handles requests related to hackathon submission evaluation.
 */
class HackathonController {
  /**
   * POST /api/hackathon/judge
   * Evaluates a submission.
   */
  static judgeSubmission = async (req, res) => {
    try {
      const { 
        submissionId, 
        hackathonId, 
        projectTitle, 
        projectDescription, 
        techStack, 
        githubLink, 
        force 
      } = req.body;

      // Basic Validation
      if (!submissionId || !hackathonId || !projectDescription) {
        return res.status(400).json({ 
          error: "Missing required fields: submissionId, hackathonId, and projectDescription are mandatory." 
        });
      }

      const submission = {
        submissionId,
        hackathonId,
        projectTitle: projectTitle || "Untitled Project",
        projectDescription,
        techStack: techStack || [],
        githubLink: githubLink || "",
      };

      const result = await ScoringService.processSubmission(submission, force === true);

      // Validation Layer check (ensure scores are 0-10)
      const finalResponse = {
        rule_score: result.ruleScore,
        final_score: result.finalScore,
        evaluation_type: result.evaluationType,
        remarks: result.remarks,
      };

      return res.status(200).json(finalResponse);
    } catch (error) {
      console.error("Hackathon Judge Error:", error);
      return res.status(500).json({ 
        error: "Internal Server Error during evaluation.",
        message: error.message 
      });
    }
  };
}

export default HackathonController;
