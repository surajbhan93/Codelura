// =============================================
// qualityChecker.js
// Task 2: Blog Content Quality Checker
// Rule-based only - No AI used
// =============================================

const express = require("express");
const router  = express.Router();

// In-memory store for submitted blogs (for duplicate checking)
// In a real app this would come from a database
const blogStore = [];

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

// Normalize text: lowercase + remove special characters
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // remove symbols
        .replace(/\s+/g, " ")         // collapse multiple spaces
        .trim();
}

// Count words in content
function countWords(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Count paragraphs (split by blank lines or <p> tags)
function countParagraphs(text) {
    return text
        .split(/\n\s*\n|<\/p>|<br\s*\/>/i)
        .filter(p => p.trim().length > 0)
        .length;
}

// Check for spammy repeated keywords
// A word is spammy if it appears more than 5% of total words
function detectSpam(text) {
    const normalized = normalizeText(text);
    const words      = normalized.split(/\s+/);
    const totalWords = words.length;

    // Count frequency of each word (ignore common stop words)
    const stopWords = new Set([
        "the","a","an","and","or","but","in","on","at","to","for",
        "of","with","is","are","was","were","be","been","has","have",
        "it","this","that","i","you","he","she","we","they","do","did"
    ]);

    const freq = {};
    words.forEach(word => {
        if (word.length > 2 && !stopWords.has(word)) {
            freq[word] = (freq[word] || 0) + 1;
        }
    });

    // Find spammy words (appearing more than 5% of total words)
    const spammyWords = Object.entries(freq)
        .filter(([word, count]) => (count / totalWords) > 0.05)
        .map(([word, count]) => ({
            word,
            count,
            percentage: ((count / totalWords) * 100).toFixed(1) + "%"
        }));

    return spammyWords;
}

// Calculate similarity between two texts using keyword overlap
function calculateSimilarity(text1, text2) {
    const words1 = new Set(normalizeText(text1).split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(normalizeText(text2).split(/\s+/).filter(w => w.length > 3));

    if (words1.size === 0 || words2.size === 0) return 0;

    // Count words that appear in both
    let commonWords = 0;
    words1.forEach(word => {
        if (words2.has(word)) commonWords++;
    });

    // Jaccard similarity: intersection / union
    const union = new Set([...words1, ...words2]).size;
    return (commonWords / union);
}

// ─────────────────────────────────────────────
// ROUTE 1: Check blog quality
// POST /api/quality/check
// Body: { blog_id, content }
// ─────────────────────────────────────────────
router.post("/check", (req, res) => {
    const { blog_id, content } = req.body;

    if (!blog_id || !content) {
        return res.status(400).json({ error: "blog_id and content are required" });
    }

    const flags   = [];
    const details = {};

    // ── Check 1: Word count ──────────────────
    const wordCount = countWords(content);
    details.word_count = wordCount;

    if (wordCount < 300) {
        flags.push("Very Short");
        details.word_count_issue = `Only ${wordCount} words (minimum 300 required)`;
    }

    // ── Check 2: Paragraph count ─────────────
    const paraCount = countParagraphs(content);
    details.paragraph_count = paraCount;

    if (paraCount < 3) {
        flags.push("Warning: Low Paragraphs");
        details.paragraph_issue = `Only ${paraCount} paragraph(s) (minimum 3 recommended)`;
    }

    // ── Check 3: Spam detection ──────────────
    const spammyWords = detectSpam(content);
    details.spammy_words = spammyWords;

    if (spammyWords.length > 0) {
        flags.push("Spam");
        details.spam_issue = `Repeated keywords detected: ${spammyWords.map(w => w.word).join(", ")}`;
    }

    // ── Final result ─────────────────────────
    const passed = flags.length === 0;

    res.json({
        success: true,
        blog_id,
        passed,
        flags,                          // e.g. ["Very Short", "Spam"]
        details,
        summary: passed
            ? "✅ Blog passed all quality checks"
            : `❌ Blog flagged for: ${flags.join(", ")}`
    });
});

// ─────────────────────────────────────────────
// ROUTE 2: Submit blog + check for duplicates
// POST /api/quality/submit
// Body: { blog_id, content }
// ─────────────────────────────────────────────
router.post("/submit", (req, res) => {
    const { blog_id, content } = req.body;

    if (!blog_id || !content) {
        return res.status(400).json({ error: "blog_id and content are required" });
    }

    // Check against all existing blogs
    const duplicates = [];

    blogStore.forEach(existing => {
        const similarity = calculateSimilarity(content, existing.content);

        if (similarity >= 0.70) {
            duplicates.push({
                matched_blog_id: existing.blog_id,
                similarity_pct:  (similarity * 100).toFixed(1) + "%"
            });
        }
    });

    if (duplicates.length > 0) {
        return res.json({
            success: true,
            blog_id,
            is_duplicate: true,
            duplicates,
            summary: `❌ Duplicate content detected! Similar to: ${duplicates.map(d => d.matched_blog_id).join(", ")}`
        });
    }

    // No duplicate found - save to store
    blogStore.push({ blog_id, content });

    res.json({
        success: true,
        blog_id,
        is_duplicate: false,
        total_blogs_stored: blogStore.length,
        summary: "✅ Content is original. Blog submitted successfully."
    });
});

// ─────────────────────────────────────────────
// ROUTE 3: Get all stored blogs (for review)
// GET /api/quality/blogs
// ─────────────────────────────────────────────
router.get("/blogs", (req, res) => {
    const list = blogStore.map(b => ({
        blog_id: b.blog_id,
        word_count: countWords(b.content)
    }));
    res.json({ success: true, total: blogStore.length, blogs: list });
});

module.exports = router;