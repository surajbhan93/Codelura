const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const qualityRoutes = require("./qualityChecker");
require("dotenv").config();

const initSqlJs = require("sql.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/quality", qualityRoutes);

const DB_PATH = path.join(__dirname, "codelura.db");

let db;

// Initialize database
initSqlJs().then(SQL => {
    // Load existing db file or create new one
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    // Create tables
    db.run(`
        CREATE TABLE IF NOT EXISTS blog_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blog_id TEXT NOT NULL,
            user_id TEXT DEFAULT 'anonymous',
            ip_address TEXT,
            viewed_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS blog_time_spent (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blog_id TEXT NOT NULL,
            user_id TEXT DEFAULT 'anonymous',
            entry_time INTEGER NOT NULL,
            exit_time INTEGER NOT NULL,
            time_spent INTEGER NOT NULL,
            visited_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS blog_scroll_depth (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blog_id TEXT NOT NULL,
            user_id TEXT DEFAULT 'anonymous',
            max_scroll_pct INTEGER NOT NULL,
            milestone_25 INTEGER DEFAULT 0,
            milestone_50 INTEGER DEFAULT 0,
            milestone_75 INTEGER DEFAULT 0,
            milestone_100 INTEGER DEFAULT 0,
            recorded_at TEXT DEFAULT (datetime('now'))
        );
    `);

    saveDb();
    console.log("Database ready");
});

// Save db to file after every write
function saveDb() {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ── 1. Track page view ──────────────────────────
app.post("/api/track/view", (req, res) => {
    const { blog_id, user_id } = req.body;
    if (!blog_id) return res.status(400).json({ error: "blog_id required" });

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    db.run(`INSERT INTO blog_views (blog_id, user_id, ip_address) VALUES (?,?,?)`,
        [blog_id, user_id || "anonymous", ip]);
    saveDb();

    res.json({ success: true, message: "View tracked" });
});

// ── 2. Track time spent ─────────────────────────
app.post("/api/track/time", (req, res) => {
    const { blog_id, user_id, entry_time, exit_time } = req.body;
    if (!blog_id || !entry_time || !exit_time)
        return res.status(400).json({ error: "blog_id, entry_time, exit_time required" });

    const time_spent = Math.floor((exit_time - entry_time) / 1000);

    if (time_spent < 5)
        return res.json({ success: false, message: "Session too short, ignored" });

    db.run(`INSERT INTO blog_time_spent (blog_id, user_id, entry_time, exit_time, time_spent) VALUES (?,?,?,?,?)`,
        [blog_id, user_id || "anonymous", entry_time, exit_time, time_spent]);
    saveDb();

    res.json({ success: true, time_spent_seconds: time_spent });
});

// ── 3. Track scroll depth ───────────────────────
app.post("/api/track/scroll", (req, res) => {
    const { blog_id, user_id, max_scroll_pct } = req.body;
    if (!blog_id || max_scroll_pct === undefined)
        return res.status(400).json({ error: "blog_id and max_scroll_pct required" });

    db.run(`INSERT INTO blog_scroll_depth (blog_id, user_id, max_scroll_pct, milestone_25, milestone_50, milestone_75, milestone_100) VALUES (?,?,?,?,?,?,?)`,
        [blog_id, user_id || "anonymous", max_scroll_pct,
            max_scroll_pct >= 25 ? 1 : 0,
            max_scroll_pct >= 50 ? 1 : 0,
            max_scroll_pct >= 75 ? 1 : 0,
            max_scroll_pct >= 100 ? 1 : 0]);
    saveDb();

    res.json({ success: true, message: "Scroll tracked" });
});

// ── 4. Blog rankings ────────────────────────────
app.get("/api/analytics/rankings", (req, res) => {
    const result = db.exec(`
        SELECT blog_id, COUNT(*) as total_views, COUNT(DISTINCT user_id) as unique_visitors
        FROM blog_views
        GROUP BY blog_id
        ORDER BY total_views DESC
    `);

    const data = result.length ? result[0].values.map(row => ({
        blog_id: row[0], total_views: row[1], unique_visitors: row[2]
    })) : [];

    res.json({ success: true, data });
});

// ── 5. Average time per blog ────────────────────
app.get("/api/analytics/time-stats", (req, res) => {
    const result = db.exec(`
        SELECT blog_id, ROUND(AVG(time_spent), 2) as avg_time_seconds, COUNT(*) as total_sessions
        FROM blog_time_spent
        GROUP BY blog_id
        ORDER BY avg_time_seconds DESC
    `);

    const data = result.length ? result[0].values.map(row => ({
        blog_id: row[0],
        avg_time_seconds: row[1],
        avg_time_readable: `${Math.floor(row[1] / 60)}m ${Math.round(row[1] % 60)}s`,
        total_sessions: row[2]
    })) : [];

    res.json({ success: true, data });
});

// ── 6. Scroll depth stats ───────────────────────
app.get("/api/analytics/scroll-stats", (req, res) => {
    const result = db.exec(`
        SELECT blog_id, ROUND(AVG(max_scroll_pct), 2) as avg_scroll,
               SUM(milestone_25), SUM(milestone_50), SUM(milestone_75), SUM(milestone_100),
               COUNT(*) as total_sessions
        FROM blog_scroll_depth
        GROUP BY blog_id
        ORDER BY avg_scroll DESC
    `);

    const data = result.length ? result[0].values.map(row => ({
        blog_id: row[0], avg_scroll_pct: row[1],
        reached_25: row[2], reached_50: row[3],
        reached_75: row[4], reached_100: row[5],
        total_sessions: row[6]
    })) : [];

    res.json({ success: true, data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));