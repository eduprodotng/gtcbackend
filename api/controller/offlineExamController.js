const Exam = require("../models/Exam");
const Session = require("../models/Session");
const mongoose = require("mongoose");

const submitExam = async (req, res) => {
  const { session, ...examData } = req.body;

  try {
    const newExam = new Exam({
      ...examData,
      session,
    });

    const savedExam = await newExam.save();
    res.status(200).json(savedExam);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExam = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    const list = await Exam.find({ session: sessionObjectId }).exec();

    if (list.length === 0) {
      return res
        .status(404)
        .json({ error: "No exams found for the specified session" });
    }

    res.status(200).json(list);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the exams" });
  }
};

const deleteExam = async (req, res) => {
  const examId = req.params.examId;

  try {
    const deletedExam = await Exam.findByIdAndDelete(examId);

    if (!deletedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addSessionToExamWithoutSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    const updateResult = await Exam.updateMany(
      { session: { $exists: false } },
      { $set: { session: sessionId } }
    );

    res.status(200).json({
      message: "Users updated successfully",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  submitExam,
  getExam,
  deleteExam,
  addSessionToExamWithoutSession,
};
