import RuleEngine from "../App/services/RuleEngine.js";

const testSubmissions = [
  {
    name: "Short description, no stack, no github",
    projectDescription: "This is a very short description.",
    techStack: [],
    githubLink: "",
    expectedRuleScore: 4.0, // 6 (base) - 2 (short) - 2 (empty stack) + 0 (quality) = 2.0? Wait.
  },
  {
    name: "Long technical description, full stack, github",
    projectDescription: ("This is a technical project description with enough words to be considered high quality. ").repeat(30) + " api database architecture schema",
    techStack: ["Node", "React", "Express"],
    githubLink: "https://github.com/user/repo",
    // 6 (base) + 1 (long) + 1 (stack) + 1 (technical) = 9.0
  },
  {
    name: "Medium description, backend only, no github (capped)",
    projectDescription: "This is a project that uses node and express to build a backend API. ".repeat(10), // ~150 words
    techStack: ["Node", "Express"],
    githubLink: "",
    // 6 (base) + 0 (medium) + 0 (stack - only backend) + 1 (technical) = 7.0 -> capped to 6.0
  }
];

testSubmissions.forEach(sub => {
  const result = RuleEngine.evaluate(sub);
  console.log(`Test: ${sub.name}`);
  console.log(`Result Score: ${result.ruleScore}`);
  console.log(`Breakdown:`, result.breakdown);
  console.log("-------------------");
});
