// controller/psyController.js
const mongoose = require("mongoose");
const Psy = require("../models/Psy");
const Exam = require("../models/Exam");

const savePsy = async (req, res) => {
  try {
    const { examId, updates } = req.body;
    const sessionId = req.params.sessionId;

    if (!updates || !Array.isArray(updates)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing updates array" });
    }

    let psyDoc = await Psy.findOne({ examId, session: sessionId });

    if (!psyDoc) {
      psyDoc = await Psy.create({
        examId,
        session: sessionId,
        marks: updates.map(({ studentId, remarks = "", premarks = "" }) => ({
          studentId,
          remarks,
          premarks,
        })),
      });

      return res.status(201).json({ message: "Psy data saved", psyDoc });
    }

    // Update existing marks
    updates.forEach(({ studentId, remarks = "", premarks = "" }) => {
      const mark = psyDoc.marks.find(
        (m) => m.studentId.toString() === studentId
      );
      if (mark) {
        mark.remarks = remarks;
        mark.premarks = premarks;
      } else {
        psyDoc.marks.push({ studentId, remarks, premarks });
      }
    });

    await psyDoc.save();
    return res.status(200).json({ message: "Psy data updated", psyDoc });
  } catch (err) {
    console.error("SavePsy Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateMarks = async (req, res) => {
  try {
    const { examId, updates } = req.body;
    if (!examId || !updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid request payload" });
    }

    const updatedResults = [];

    for (const update of updates) {
      const { studentId, remarks, premarks } = update;

      const result = await Psy.findOneAndUpdate(
        { examId, "marks.studentId": studentId },
        {
          $set: {
            "marks.$.remarks": remarks,
            "marks.$.premarks": premarks,
          },
        },
        { new: true }
      );

      if (!result) {
        // Add if not exists
        await Psy.findOneAndUpdate(
          { examId },
          {
            $push: {
              marks: { studentId, remarks, premarks },
            },
          },
          { upsert: true, new: true }
        );
      }

      updatedResults.push({ studentId, remarks, premarks });
    }

    res.status(200).json({ message: "Psy marks updated", updatedResults });
  } catch (err) {
    console.error("UpdateMarks Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getScores = async (req, res) => {
  try {
    const { examId } = req.params;

    const psyDoc = await Psy.findOne({ examId }).populate(
      "marks.studentId",
      "fullname admNo"
    );

    if (!psyDoc) return res.status(200).json({ scores: [] });

    res.status(200).json({ scores: psyDoc.marks });
  } catch (err) {
    console.error("GetScores Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPsybyStudent = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;
    const psyDocs = await Psy.find({
      session: sessionId,
      "marks.studentId": studentId,
    }).populate("examId", "name");

    const records = psyDocs.flatMap((doc) =>
      doc.marks
        .filter((m) => m.studentId.toString() === studentId)
        .map((m) => ({
          examId: doc.examId._id,
          examName: doc.examId.name,
          remarks: m.remarks,
          premarks: m.premarks,
        }))
    );

    res.status(200).json({ studentId, records });
  } catch (err) {
    console.error("GetPsyByStudent Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateMark = async (req, res) => {
  try {
    const { examId, remarks, premarks } = req.body;
    const studentId = req.params.studentId;

    const updated = await Psy.findOneAndUpdate(
      { examId, "marks.studentId": studentId },
      {
        $set: {
          "marks.$.remarks": remarks,
          "marks.$.premarks": premarks,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student record not found." });
    }

    res.status(200).json({ message: "Record updated", updated });
  } catch (err) {
    console.error("UpdateMark Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  savePsy,
  updateMarks,
  getScores,
  getPsybyStudent,
  updateMark,
};
