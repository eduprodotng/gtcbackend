const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference teacher
      required: true,
    },
    classname: {
      type: String, // tech_1, tech_2, etc.
      enum: ["tech_1", "tech_2", "tech_3"],
      required: true,
    },
    tradeSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section", // new field
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", SubjectSchema);
