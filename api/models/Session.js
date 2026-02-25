// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 2024/2025
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false }, // To mark the current active session
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
