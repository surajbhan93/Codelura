// routes/engagementRoutes.js
const express = require("express");
const router  = express.Router();
const { BlogView, BlogTime, BlogScroll } = require("../models/engagementModel");

// ── 1. Track page view ─────────────────────────────
// POST /api/track/view
router.post("/view", async (req, res) => {
    const { blog_id, user_id } = req.body;
    if (!blog_id) return res.status(400).json({ error: "blog_id is required" });

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await BlogView.create({ blog_id, user_id, ip_address: ip });
    res.json({ success: true, message: "View tracked" });
});

// ── 2. Track time spent ────────────────────────────
// POST /api/track/time
router.post("/time", async (req, res) => {
    const { blog_id, user_id, entry_time, exit_time } = req.body;
    if (!blog_id || !entry_time || !exit_time)
        return res.status(400).json({ error: "blog_id, entry_time, exit_time required" });

    const time_spent = Math.floor((exit_time - entry_time) / 1000);

    // Ignore sessions under 5 seconds (bounce noise)
    if (time_spent < 5)
        return res.json({ success: false, message: "Session too short, ignored" });

    await BlogTime.create({ blog_id, user_id, entry_time, exit_time, time_spent });
    res.json({ success: true, time_spent_seconds: time_spent });
});

// ── 3. Track scroll depth ──────────────────────────
// POST /api/track/scroll
router.post("/scroll", async (req, res) => {
    const { blog_id, user_id, max_scroll_pct } = req.body;
    if (!blog_id || max_scroll_pct === undefined)
        return res.status(400).json({ error: "blog_id and max_scroll_pct required" });

    await BlogScroll.create({
        blog_id, user_id, max_scroll_pct,
        milestone_25:  max_scroll_pct >= 25,
        milestone_50:  max_scroll_pct >= 50,
        milestone_75:  max_scroll_pct >= 75,
        milestone_100: max_scroll_pct >= 100,
    });
    res.json({ success: true, message: "Scroll tracked" });
});

// ── 4. Get blog rankings ───────────────────────────
// GET /api/analytics/rankings
router.get("/rankings", async (req, res) => {
    const views = await BlogView.aggregate([
        { $group: {
            _id: "$blog_id",
            total_views:     { $sum: 1 },
            unique_visitors: { $addToSet: "$user_id" }
        }},
        { $project: {
            blog_id:         "$_id",
            total_views:     1,
            unique_visitors: { $size: "$unique_visitors" }
        }},
        { $sort: { total_views: -1 } }
    ]);
    res.json({ success: true, data: views });
});

// ── 5. Get average time per blog ───────────────────
// GET /api/analytics/time
router.get("/time-stats", async (req, res) => {
    const stats = await BlogTime.aggregate([
        { $group: {
            _id:            "$blog_id",
            avg_time:       { $avg: "$time_spent" },
            total_sessions: { $sum: 1 }
        }},
        { $sort: { avg_time: -1 } }
    ]);

    const data = stats.map(s => ({
        blog_id:          s._id,
        avg_time_seconds: Math.round(s.avg_time),
        avg_time_readable: `${Math.floor(s.avg_time / 60)}m ${Math.round(s.avg_time % 60)}s`,
        total_sessions:   s.total_sessions
    }));

    res.json({ success: true, data });
});

// ── 6. Get scroll depth stats ──────────────────────
// GET /api/analytics/scroll-stats
router.get("/scroll-stats", async (req, res) => {
    const stats = await BlogScroll.aggregate([
        { $group: {
            _id:            "$blog_id",
            avg_scroll:     { $avg: "$max_scroll_pct" },
            reached_25:     { $sum: { $cond: ["$milestone_25",  1, 0] } },
            reached_50:     { $sum: { $cond: ["$milestone_50",  1, 0] } },
            reached_75:     { $sum: { $cond: ["$milestone_75",  1, 0] } },
            reached_100:    { $sum: { $cond: ["$milestone_100", 1, 0] } },
            total_sessions: { $sum: 1 }
        }},
        { $sort: { avg_scroll: -1 } }
    ]);
    res.json({ success: true, data: stats });
});

module.exports = router;