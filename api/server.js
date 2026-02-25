const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db2");

const authRoute = require("./routes/authRoute");
const psyRoute = require("./routes/psyRoute");
const sessionRoute = require("./routes/sessionRoute");
const subRoute = require("./routes/subRoute");
const offlineRoute = require("./routes/offlineRoute");
const sectionRoute = require("./routes/sectionRoute");
const aiRoute = require("./routes/aiRoute");
dotenv.config();
// console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);
const app = express();
connectDB();
app.use(express.json());
// app.use(express.json({ limit: "50gb" }));
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://gtclagos.edupro.com.ng",
  ], // specify your client's URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "X-Api-Key"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// app.use(
//   session({
//     // secret: process.env.GOOGLE_CLIENT_SECRET,
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//       ttl: 14 * 24 * 60 * 60, // optional: session expires in 14 days
//     }),
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());

app.use("/api/auth", authRoute);
app.use("/api/section", sectionRoute);
app.use("/api/session", sessionRoute);
app.use("/api/offline", offlineRoute);
app.use("/api/subject", subRoute);
app.use("/api/", psyRoute);
app.use("/api/ai", aiRoute);

// Use commonRouter with specific routes requiring authentication
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 8002;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on port ${PORT}`);
});
