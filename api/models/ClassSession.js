const mongoose = require("mongoose");

const classSessionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    tech: { type: String, enum: ["tech_1", "tech_2", "tech_3"] },
    startTime: { type: Date },
    endTime: { type: Date },
    status: {
      type: String,
      enum: [
        "pending_start",
        "approved_start",
        "pending_end",
        "approved_end",
        "rejected",
      ],
      default: "pending_start",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: {
      lat: { type: Number },
      lon: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassSession", classSessionSchema);
