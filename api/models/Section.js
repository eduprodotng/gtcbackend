// models/Section.js
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hod: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: { type: String },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
});

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
