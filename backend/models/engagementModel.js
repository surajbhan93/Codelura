// models/engagementModel.js
const mongoose = require("mongoose");

// Schema for page views
const blogViewSchema = new mongoose.Schema({
    blog_id:    { type: String, required: true },
    user_id:    { type: String, default: "anonymous" },
    ip_address: { type: String },
    viewed_at:  { type: Date, default: Date.now }
});

// Schema for time spent on blog
const blogTimeSchema = new mongoose.Schema({
    blog_id:    { type: String, required: true },
    user_id:    { type: String, default: "anonymous" },
    entry_time: { type: Number, required: true },
    exit_time:  { type: Number, required: true },
    time_spent: { type: Number, required: true }, // in seconds
    visited_at: { type: Date, default: Date.now }
});

// Schema for scroll depth
const blogScrollSchema = new mongoose.Schema({
    blog_id:        { type: String, required: true },
    user_id:        { type: String, default: "anonymous" },
    max_scroll_pct: { type: Number, required: true }, // 0 to 100
    milestone_25:   { type: Boolean, default: false },
    milestone_50:   { type: Boolean, default: false },
    milestone_75:   { type: Boolean, default: false },
    milestone_100:  { type: Boolean, default: false },
    recorded_at:    { type: Date, default: Date.now }
});

const BlogView   = mongoose.model("BlogView",   blogViewSchema);
const BlogTime   = mongoose.model("BlogTime",   blogTimeSchema);
const BlogScroll = mongoose.model("BlogScroll", blogScrollSchema);

module.exports = { BlogView, BlogTime, BlogScroll };