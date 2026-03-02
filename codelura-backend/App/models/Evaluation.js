// Evaluation model - simple in-memory store
// (MongoDB can be connected later when network allows)

const evaluations = new Map();

const Evaluation = {
    async findOne({ submissionId }) {
        return evaluations.get(submissionId) || null;
    },

    async save(data) {
        evaluations.set(data.submissionId, data);
        return data;
    }
};

// Simple evaluation object constructor
export function createEvaluation(submissionId, projectTitle) {
    return {
        submissionId,
        projectTitle,
        classificationResult: { level: "MEDIUM", confidence: 0, method: "RULE_BASED" },
        plagiarismResult:     { level: "LOW", score: 0, method: "RULE_BASED" },
        innovationScore:  0,
        feasibilityScore: 0,
        impactScore:      0,
        ruleScore:        0,
        finalScore:       0,
        evaluationType:   "RULE",
        feedback:         "",
        feedbackType:     "RULE_BASED",
        aiModulesUsed:    [],
        pipelineStatus:   "PENDING",
        processedAt:      null,
        save: async function() {
            evaluations.set(this.submissionId, this);
            return this;
        }
    };
}

export default {
    findOne: async ({ submissionId }) => evaluations.get(submissionId) || null
};