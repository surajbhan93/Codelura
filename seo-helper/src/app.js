require("dotenv").config();

const express = require("express");
const cors = require("cors");

const seoRoute = require("./routes/seoRoute");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

// Enable CORS (important if frontend calls API)
app.use(cors());

// Parse JSON body
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

/* -------------------- ROUTES -------------------- */

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "SEO Helper API is running"
  });
});

// SEO Feature Route
app.use("/ai", seoRoute);

/* -------------------- 404 HANDLER -------------------- */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    error: "Internal Server Error"
  });
});

/* -------------------- SERVER START -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SEO Helper running on port ${PORT}`);
});