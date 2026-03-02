// AI Usage Decision Engine - Controls when AI should be called

// Configuration (can be moved to env later)
const CONFIG = {
  MAX_AI_CALLS_PER_DAY: 100,
  MIN_RULE_SCORE_FOR_AI: 7.0,
  RATE_LIMIT_PER_MINUTE: 10,
};

// In-memory cache (in production, use Redis)
const decisionCache = new Map();
const rateLimitTracker = new Map();

// Helper: Check rate limit
const checkRateLimit = () => {
  const currentMinute = Math.floor(Date.now() / 60000);
  const key = `rate_${currentMinute}`;
  
  const count = rateLimitTracker.get(key) || 0;
  
  if (count >= CONFIG.RATE_LIMIT_PER_MINUTE) {
    return false; // Rate limit exceeded
  }
  
  rateLimitTracker.set(key, count + 1);
  
  // Clean old entries
  if (rateLimitTracker.size > 5) {
    const oldKeys = Array.from(rateLimitTracker.keys()).slice(0, -2);
    oldKeys.forEach(k => rateLimitTracker.delete(k));
  }
  
  return true;
};

// Main decision function
export const makeUsageDecision = async (req, res) => {
  try {
    const {
      requestType,
      submissionId,
      ruleScore,
      classificationLevel,
      plagiarismLevel,
      currentAiCallsUsed,
      maxAiCallsAllowed = CONFIG.MAX_AI_CALLS_PER_DAY
    } = req.body;

    // Validation
    if (!requestType || !submissionId) {
      return res.status(400).json({
        allowAiCall: false,
        decision: "BLOCK",
        reason: "Missing required fields: requestType or submissionId"
      });
    }

    // Check cache
    const cacheKey = `${submissionId}_${requestType}`;
    if (decisionCache.has(cacheKey)) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      return res.json(decisionCache.get(cacheKey));
    }

    // Check rate limit
    if (!checkRateLimit()) {
      const response = {
        allowAiCall: false,
        decision: "FALLBACK",
        reason: "Rate limit exceeded - using rule-based fallback",
        fallbackStrategy: "RULE_BASED_ONLY"
      };
      return res.json(response);
    }

    // Decision Logic
    let decision = "BLOCK";
    let reason = "";
    let allowAiCall = false;
    let fallbackStrategy = "RULE_BASED_ONLY";

    // Rule 1: Budget Check (CRITICAL)
    if (currentAiCallsUsed >= maxAiCallsAllowed) {
      decision = "FALLBACK";
      reason = "AI budget exhausted - using rule-based scoring";
      allowAiCall = false;
    }
    
    // Rule 2: Low Quality Block
    else if (classificationLevel === "LOW") {
      decision = "BLOCK";
      reason = "Low quality submission - rule-based result sufficient";
      allowAiCall = false;
    }
    
    // Rule 3: High Plagiarism Block
    else if (plagiarismLevel === "HIGH") {
      decision = "BLOCK";
      reason = "High plagiarism detected - marked for manual review";
      allowAiCall = false;
      fallbackStrategy = "MANUAL_REVIEW";
    }
    
    // Rule 4: High Priority ALLOW
    else if (
      classificationLevel === "HIGH" && 
      ruleScore >= CONFIG.MIN_RULE_SCORE_FOR_AI &&
      currentAiCallsUsed < maxAiCallsAllowed
    ) {
      decision = "ALLOW";
      reason = "High-quality submission and budget available";
      allowAiCall = true;
      fallbackStrategy = null;
    }
    
    // Rule 5: Medium Priority Conditional
    else if (classificationLevel === "MEDIUM" && ruleScore >= 6.5) {
      // Allow only if budget is > 20% remaining
      const budgetRemaining = ((maxAiCallsAllowed - currentAiCallsUsed) / maxAiCallsAllowed) * 100;
      
      if (budgetRemaining > 20) {
        decision = "ALLOW";
        reason = "Medium quality with sufficient budget";
        allowAiCall = true;
        fallbackStrategy = null;
      } else {
        decision = "FALLBACK";
        reason = "Medium quality but low budget - conserving AI calls";
        allowAiCall = false;
      }
    }
    
    // Default: Block
    else {
      decision = "BLOCK";
      reason = "Does not meet criteria for AI usage";
      allowAiCall = false;
    }

    // Prepare response
    const response = {
      allowAiCall,
      decision,
      reason,
      ...(fallbackStrategy && { fallbackStrategy })
    };

    // Cache the decision (5 minutes TTL)
    decisionCache.set(cacheKey, response);
    setTimeout(() => decisionCache.delete(cacheKey), 5 * 60 * 1000);

    // Log metrics (in production, send to analytics)
    console.log(`📊 AI Decision: ${decision} | Type: ${requestType} | Score: ${ruleScore}`);

    return res.status(200).json(response);

  } catch (error) {
    console.error("AI Usage Decision Error:", error);
    
    // Graceful fallback on error
    return res.status(200).json({
      allowAiCall: false,
      decision: "FALLBACK",
      reason: "System error - using rule-based fallback",
      fallbackStrategy: "RULE_BASED_ONLY"
    });
  }
};

// Get current usage stats
export const getUsageStats = async (req, res) => {
  try {
    // In production, fetch from database
    const stats = {
      totalRequests: decisionCache.size,
      cacheSize: decisionCache.size,
      rateLimitRemaining: CONFIG.RATE_LIMIT_PER_MINUTE - (rateLimitTracker.get(`rate_${Math.floor(Date.now() / 60000)}`) || 0),
      config: CONFIG
    };

    return res.json(stats);
  } catch (error) {
    console.error("Stats Error:", error);
    return res.status(500).json({ message: "Error fetching stats" });
  }
};