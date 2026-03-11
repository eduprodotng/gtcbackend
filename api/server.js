// VERCEL-COMPATIBLE SERVER — exports app instead of calling app.listen()
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const path = require("path");

const connectDB = require("./config/db2");

const authRoute = require("./routes/authRoute");
const blogRoute = require("./routes/blogRoute");
const psyRoute = require("./routes/psyRoute");
const sessionRoute = require("./routes/sessionRoute");
const subRoute = require("./routes/subRoute");
const offlineRoute = require("./routes/offlineRoute");
const sectionRoute = require("./routes/sectionRoute");
const aiRoute = require("./routes/aiRoute");

console.log("KEY:", JSON.stringify(process.env.AWS_ACCESS_KEY_ID));
console.log("SECRET:", JSON.stringify(process.env.AWS_SECRET_ACCESS_KEY));
console.log("REGION:", JSON.stringify(process.env.AWS_REGION));

const app = express();
connectDB();

// ── CORS — must come BEFORE everything else ──────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:5173",
  "https://gtclagos.edupro.com.ng",
  "https://clarionglobalenergy.com",        // without www
  "https://www.clarionglobalenergy.com",    // with www
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "X-Api-Key"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle all preflight OPTIONS requests

// ── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Passport ─────────────────────────────────────────────────────────────────
app.use(passport.initialize());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoute);
app.use("/api/", blogRoute);
app.use("/api/section", sectionRoute);
app.use("/api/session", sessionRoute);
app.use("/api/offline", offlineRoute);
app.use("/api/subject", subRoute);
app.use("/api/", psyRoute);
app.use("/api/ai", aiRoute);

// ── Error handling ────────────────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// ── IMPORTANT: Export for Vercel (no app.listen!) ────────────────────────────
// Vercel is serverless. It calls your app as a function, not a running server.
// app.listen() is silently IGNORED on Vercel — this is why CORS never ran!
module.exports = app;

// Only listen when running locally with `node server.js`
if (require.main === module) {
  const PORT = process.env.PORT || 8002;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}
