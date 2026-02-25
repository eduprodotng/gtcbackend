const mongoose = require("mongoose");
const Mark = require("../models/Mark");
const User = require("../models/User");
const Exam = require("../models/Exam");
const Subject = require("../models/Subject");
const Session = require("../models/Session");

// const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//       return res.status(400).json({ error: "Invalid session ID" });
//     }

//     if (!updates || !Array.isArray(updates)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or missing updates array" });
//     }

//     const existingMarks = await Mark.findOne({ examId, subjectId, sessionId });

//     if (!existingMarks || existingMarks.marks.length === 0) {
//       const savedMarks = await Mark.create({
//         examId,
//         subjectId,
//         session: sessionId,
//         marks: updates.map((mark) => ({
//           studentId: mark.studentId,
//           subjectId,
//           testscore: mark.testscore,
//           examscore: mark.examscore,
//           marksObtained: mark.marksObtained,
//           comment: mark.comment,
//         })),
//       });

//       return res
//         .status(201)
//         .json({ message: "Marks saved successfully", savedMarks });
//     }

//     existingMarks.marks.forEach((existingMark) => {
//       const update = updates.find(
//         (mark) => mark.studentId === existingMark.studentId.toString()
//       );
//       if (update) {
//         Object.assign(existingMark, update);
//       }
//     });

//     await existingMarks.save();

//     res.status(200).json({
//       message: "Marks updated successfully",
//       updatedMarks: existingMarks,
//     });
//   } catch (error) {
//     console.error("Error saving/updating marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//       return res.status(400).json({ error: "Invalid session ID" });
//     }

//     if (!updates || !Array.isArray(updates)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or missing updates array" });
//     }

//     let markDoc = await Mark.findOne({ examId, session: sessionId });

//     if (!markDoc) {
//       markDoc = await Mark.create({
//         examId,
//         session: sessionId,
//         marks: [],
//       });
//     }

//     // Remove existing marks for this subject
//     markDoc.marks = markDoc.marks.filter(
//       (entry) => entry.subjectId.toString() !== subjectId
//     );

//     // Add the updated marks for this subject
//     const newMarks = updates.map((mark) => ({
//       studentId: mark.studentId,
//       subjectId,
//       testscore: mark.testscore,
//       examscore: mark.examscore,
//       marksObtained: mark.marksObtained,
//       comment: mark.comment,
//     }));

//     markDoc.marks.push(...newMarks);
//     await markDoc.save();

//     return res
//       .status(200)
//       .json({ message: "Marks saved successfully", data: markDoc });
//   } catch (error) {
//     console.error("Error saving marks:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const saveMark = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const { examId, subjectId, updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Check if updates array is present in the request body
    if (!updates || !Array.isArray(updates)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing updates array" });
    }

    // Fetch existing marks for the specified exam and subject
    const existingMarks = await Mark.findOne({ examId, subjectId, sessionId });

    // If existing marks are not found or the array is empty, proceed to create new marks
    if (!existingMarks || existingMarks.marks.length === 0) {
      // Save marks to the database using the provided examId and subjectId
      const savedMarks = await Mark.create({
        examId,
        subjectId,
        session: sessionId,
        marks: await Promise.all(
          updates.map(async (mark) => {
            const { studentId, testscore, examscore, marksObtained, comment } =
              mark;

            return {
              studentId,
              subjectId: subjectId, // Add subjectId
              testscore,
              examscore,
              marksObtained,
              comment,
            };
          })
        ),
      });

      return res.status(201).json({
        message: "Marks saved successfully",
        savedMarks,
      });
    }

    // If existing marks are found, update the marks
    existingMarks.marks.forEach((existingMark) => {
      const update = updates.find(
        (mark) => mark.studentId === existingMark.studentId
      );

      if (update) {
        existingMark.testscore = update.testscore;
        existingMark.examscore = update.examscore;
        existingMark.marksObtained = update.marksObtained;
        existingMark.comment = update.comment;
      }
    });

    await existingMarks.save();

    res.status(200).json({
      message: "Marks updated successfully",
      updatedMarks: existingMarks,
    });
  } catch (error) {
    console.error("Error saving/updating marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getMark = async (req, res) => {
  try {
    const { examName, sessionId } = req.params;
    const fetchedExam = await Exam.findOne({ name: examName });
    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    if (!fetchedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const marks = await Mark.find({
      examId: fetchedExam._id,
      session: sessionObjectId,
    });
    if (marks.length === 0) {
      return res.status(404).json({ message: "Marks not found" });
    }

    const scores = marks.map((mark) => ({
      subjectId: mark.subjectId,
      ...mark.toObject(),
    }));
    res.status(200).json({ examId: fetchedExam._id, scores });
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMarkbyStudent = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;

    const marks = await Mark.find({
      "marks.studentId": studentId,
      session: sessionId,
    })
      .populate("examId", "name")
      .populate("marks.subjectId", "name");

    const scores = marks.flatMap((mark) =>
      mark.marks
        .filter(
          (m) =>
            m.studentId.toString() === studentId &&
            (m.testscore || m.examscore) &&
            m.comment.trim() &&
            mark.examId &&
            m.subjectId
        )
        .map((m) => ({
          examId: mark.examId,
          subjectId: m.subjectId,
          examName: mark.examId.name,
          subjectName: m.subjectId.name,
          testscore: m.testscore,
          ...m.toObject(),
        }))
    );

    const uniqueScores = scores.reduce((acc, current) => {
      const isDuplicate = acc.some(
        (item) =>
          item.examId._id.toString() === current.examId._id.toString() &&
          item.subjectId._id.toString() === current.subjectId._id.toString()
      );
      if (!isDuplicate) acc.push(current);
      return acc;
    }, []);

    res.status(200).json({ studentId, sessionId, scores: uniqueScores });
  } catch (error) {
    console.error("Error fetching marks for student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const getBroadsheet = async (req, res) => {
//   const { examId, sectionId, tech } = req.params;

//   if (
//     !mongoose.Types.ObjectId.isValid(examId) ||
//     !mongoose.Types.ObjectId.isValid(sectionId)
//   ) {
//     return res.status(400).json({ message: "Invalid exam or section ID" });
//   }

//   try {
//     // Step 1: Get all subjects for this section and tech
//     const subjects = await Subject.find({
//       tradeSection: sectionId,
//       classname: tech,
//     });

//     const subjectIds = subjects.map((s) => s._id);

//     // Step 2: Get all marks for the selected exam and relevant subjects
//     const marks = await Mark.find({
//       examId: examId,
//       subjectId: { $in: subjectIds },
//     });

//     const scores = {}; // scores[studentId][subjectId] = { test, exam, total }

//     marks.forEach((markDoc) => {
//       const subjectId = markDoc.subjectId.toString();
//       markDoc.marks.forEach((entry) => {
//         const studentId = entry.studentId.toString();

//         if (!scores[studentId]) scores[studentId] = {};

//         scores[studentId][subjectId] = {
//           test: entry.testscore || 0,
//           exam: entry.examscore || 0,
//           total: (entry.testscore || 0) + (entry.examscore || 0),
//         };
//       });
//     });

//     return res.status(200).json({ scores });
//   } catch (err) {
//     console.error("Error fetching broadsheet:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// const getBroadsheet = async (req, res) => {
//   const { examId, sectionId, tech } = req.params;

//   if (
//     !mongoose.Types.ObjectId.isValid(examId) ||
//     !mongoose.Types.ObjectId.isValid(sectionId)
//   ) {
//     return res.status(400).json({ message: "Invalid exam or section ID" });
//   }

//   try {
//     // 1. Get all relevant subjects
//     const subjects = await Subject.find({
//       tradeSection: sectionId,
//       classname: tech,
//     });

//     const subjectIds = subjects.map((s) => s._id.toString());

//     // 2. Fetch all mark documents for the exam
//     const markDocs = await Mark.find({ examId });

//     const scores = {}; // scores[studentId][subjectId] = { test, exam, total }

//     markDocs.forEach((doc) => {
//       doc.marks.forEach((entry) => {
//         const studentId = entry.studentId.toString();
//         const subjectId = entry.subjectId?.toString(); // Ensure subjectId exists

//         if (!subjectId || !subjectIds.includes(subjectId)) return;

//         if (!scores[studentId]) scores[studentId] = {};

//         scores[studentId][subjectId] = {
//           test: entry.testscore || 0,
//           exam: entry.examscore || 0,
//           total: (entry.testscore || 0) + (entry.examscore || 0),
//         };
//       });
//     });

//     return res.status(200).json({ scores });
//   } catch (err) {
//     console.error("Error fetching broadsheet:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// const getBroadsheet = async (req, res) => {
//   const { examId, sectionId, tech } = req.params;

//   if (
//     !mongoose.Types.ObjectId.isValid(examId) ||
//     !mongoose.Types.ObjectId.isValid(sectionId)
//   ) {
//     return res.status(400).json({ message: "Invalid exam or section ID" });
//   }

//   try {
//     // Step 1: Fetch all marks for the exam and populate subjectId
//     const markDocs = await Mark.find({ examId }).populate({
//       path: "marks.subjectId",
//       model: "Subject",
//       select: "tradeSection classname", // we only need this info
//     });

//     const scores = {}; // scores[studentId][subjectId] = { test, exam, total }

//     // Step 2: Loop through all marks
//     markDocs.forEach((doc) => {
//       doc.marks.forEach((entry) => {
//         const studentId = entry.studentId?.toString();
//         const subject = entry.subjectId;

//         // Validate populated subject
//         if (
//           !subject ||
//           subject.tradeSection?.toString() !== sectionId ||
//           subject.classname !== tech
//         ) {
//           return; // skip if not matching section/tech
//         }

//         const subjectId = subject._id.toString();

//         if (!scores[studentId]) scores[studentId] = {};

//         scores[studentId][subjectId] = {
//           test: entry.testscore || 0,
//           exam: entry.examscore || 0,
//           total: (entry.testscore || 0) + (entry.examscore || 0),
//         };
//       });
//     });

//     return res.status(200).json({ scores });
//   } catch (err) {
//     console.error("Error fetching broadsheet:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const getBroadsheet = async (req, res) => {
  const { examId, sectionId, tech } = req.params;

  console.log("➡️ Request Params:", { examId, sectionId, tech });

  if (
    !mongoose.Types.ObjectId.isValid(examId) ||
    !mongoose.Types.ObjectId.isValid(sectionId)
  ) {
    console.error("❌ Invalid ObjectId(s)");
    return res.status(400).json({ message: "Invalid exam or section ID" });
  }

  try {
    console.log("🔍 Fetching Mark documents...");
    const markDocs = await Mark.find({ examId }).populate({
      path: "marks.subjectId",
      select: "tradeSection classname name",
    });

    console.log("✅ Fetched Marks with populated subjects:");
    console.dir(markDocs, { depth: 10 });

    const scores = {};

    markDocs.forEach((doc, docIndex) => {
      console.log(
        `📄 Processing MarkDoc[${docIndex}] with ${doc.marks.length} marks`
      );
      doc.marks.forEach((entry, entryIndex) => {
        const studentId = entry.studentId?.toString();
        const subject = entry.subjectId;

        if (!subject) {
          console.warn(
            `⚠️ Entry[${entryIndex}] - Subject is null or not populated.`
          );
          return;
        }

        console.log(
          `🔎 Entry[${entryIndex}] - Student: ${studentId}, Subject: ${subject._id}, TradeSection: ${subject.tradeSection}, Classname: ${subject.classname}`
        );

        if (String(subject.tradeSection) !== String(sectionId)) {
          console.log(
            `⛔ Skipped: Trade section mismatch. Expected: ${sectionId}, Found: ${subject.tradeSection}`
          );
          return;
        }

        if (subject.classname !== tech) {
          console.log(
            `⛔ Skipped: Classname mismatch. Expected: ${tech}, Found: ${subject.classname}`
          );
          return;
        }

        const subjectId = subject._id.toString();

        if (!scores[studentId]) scores[studentId] = {};

        scores[studentId][subjectId] = {
          test: entry.testscore || 0,
          exam: entry.examscore || 0,
          total: (entry.testscore || 0) + (entry.examscore || 0),
        };

        console.log(
          `✅ Added score for Student ${studentId}, Subject ${subjectId}`
        );
      });
    });

    console.log("🎯 Final Scores Object:", JSON.stringify(scores, null, 2));
    return res.status(200).json({ scores });
  } catch (err) {
    console.error("🔥 Error fetching broadsheet:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMarkbyStudentwithoutsession = async (req, res) => {
  try {
    const userId = req.params.studentId;
    const marks = await Mark.find({ "marks.studentId": userId })
      .populate("examId", "name")
      .populate("marks.subjectId", "name");

    const uniqueSubjects = new Map();

    const scores = marks.flatMap((mark) =>
      mark.marks
        .filter(
          (m) =>
            m.studentId.toString() === userId &&
            (m.testscore || m.examscore) &&
            m.comment.trim() &&
            mark.examId &&
            m.subjectId
        )
        .map((m) => {
          const subjectKey = m.subjectId._id.toString();
          if (!uniqueSubjects.has(subjectKey)) {
            uniqueSubjects.set(subjectKey, true);
            return {
              examId: mark.examId,
              subjectId: m.subjectId,
              examName: mark.examId.name,
              subjectName: m.subjectId.name,
              testscore: m.testscore,
              ...m.toObject(),
            };
          }
          return null;
        })
        .filter(Boolean)
    );

    res.status(200).json({ studentId: userId, scores });
  } catch (error) {
    console.error("Error fetching marks for student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId } = req.params;
//     if (
//       !mongoose.isValidObjectId(examId) ||
//       !mongoose.isValidObjectId(subjectId)
//     ) {
//       return res.status(400).json({ message: "Invalid ObjectId format" });
//     }

//     const marks = await Mark.findOne({
//       examId: mongoose.Types.ObjectId(examId),
//       "marks.subjectId": mongoose.Types.ObjectId(subjectId),
//     });

//     if (!marks) {
//       return res.status(200).json({ examId, subjectId, scores: [] });
//     }

//     await Mark.populate(marks, {
//       path: "marks.studentId",
//       select: "studentName",
//     });
//     const scores = marks.marks.map((m) => ({
//       studentId: m.studentId,
//       studentName: m.studentId ? m.studentId.studentName : null,
//       testscore: m.testscore,
//       examscore: m.examscore,
//       marksObtained: m.testscore + m.examscore,
//       comment: m.comment,
//     }));

//     res.status(200).json({ examId, subjectId, scores });
//   } catch (error) {
//     console.error("Error fetching scores:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId } = req.params;

//     if (
//       !mongoose.isValidObjectId(examId) ||
//       !mongoose.isValidObjectId(subjectId)
//     ) {
//       return res.status(400).json({ message: "Invalid ObjectId format" });
//     }

//     const marks = await Mark.findOne({
//       examId: mongoose.Types.ObjectId(examId),
//       "marks.subjectId": mongoose.Types.ObjectId(subjectId),
//     });

//     if (!marks) {
//       return res.status(200).json({ examId, subjectId, scores: [] });
//     }

//     // Only get marks for the given subjectId
//     const filteredMarks = marks.marks.filter(
//       (m) => m.subjectId.toString() === subjectId
//     );

//     await Mark.populate(marks, {
//       path: "marks.studentId",
//       select: "studentName",
//     });

//     const scores = filteredMarks.map((m) => {
//       const student = marks.marks.find(
//         (x) =>
//           x.studentId && x.studentId._id.toString() === m.studentId.toString()
//       );
//       return {
//         studentId: student?.studentId,
//         studentName: student?.studentId?.studentName || "",
//         testscore: m.testscore,
//         examscore: m.examscore,
//         marksObtained: m.testscore + m.examscore,
//         comment: m.comment,
//       };
//     });

//     res.status(200).json({ examId, subjectId, scores });
//   } catch (error) {
//     console.error("Error fetching scores:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const saveOrUpdateMarks = async (req, res) => {
  const { sessionId } = req.params;
  const { examId, subjectId, updates } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    if (!examId || !subjectId || !Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    let markDoc = await Mark.findOne({ examId, session: sessionId });

    if (!markDoc) {
      // Create if doesn't exist
      markDoc = await Mark.create({
        examId,
        session: sessionId,
        marks: [],
      });
    }

    // Remove any existing marks for this subject
    markDoc.marks = markDoc.marks.filter(
      (entry) => entry.subjectId.toString() !== subjectId
    );

    // Add new updated marks
    const newMarks = updates.map((u) => ({
      studentId: u.studentId,
      subjectId,
      testscore: u.testscore,
      examscore: u.examscore,
      marksObtained: u.marksObtained,
      comment: u.comment,
    }));

    markDoc.marks.push(...newMarks);
    await markDoc.save();

    res.status(200).json({ message: "Marks saved/updated successfully" });
  } catch (error) {
    console.error("Error saving/updating marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ CONTROLLER: Get Scores for Specific Exam + Subject
// const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId } = req.params;

//     if (
//       !mongoose.Types.ObjectId.isValid(examId) ||
//       !mongoose.Types.ObjectId.isValid(subjectId)
//     ) {
//       return res.status(400).json({ message: "Invalid ObjectId format" });
//     }

//     const markDoc = await Mark.findOne({
//       examId,
//       "marks.subjectId": subjectId,
//     });

//     if (!markDoc) {
//       return res.status(200).json({ scores: [] });
//     }

//     const filteredMarks = markDoc.marks.filter(
//       (m) => m.subjectId.toString() === subjectId
//     );

//     const populatedMarks = await Promise.all(
//       filteredMarks.map(async (m) => {
//         const student = await User.findById(m.studentId).select("studentName");
//         return {
//           studentId: m.studentId,
//           studentName: student?.studentName || "",
//           testscore: m.testscore,
//           examscore: m.examscore,
//           marksObtained: m.marksObtained,
//           comment: m.comment,
//         };
//       })
//     );

//     res.status(200).json({ scores: populatedMarks });
//   } catch (error) {
//     console.error("Error fetching scores:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const getScores = async (req, res) => {
  try {
    const { examId, subjectId } = req.params;

    const isExamIdValid = mongoose.isValidObjectId(examId);
    const isSubjectIdValid = mongoose.isValidObjectId(subjectId);

    if (!isExamIdValid && !isSubjectIdValid) {
      return res.status(400).json({
        message: "Invalid ObjectId format for both examId and subjectId",
      });
    }

    const marks = await Mark.findOne({
      examId: isExamIdValid ? mongoose.Types.ObjectId(examId) : null,
      "marks.subjectId": isSubjectIdValid
        ? mongoose.Types.ObjectId(subjectId)
        : null,
    });

    if (!marks) {
      return res.status(200).json({ examId, subjectId, scores: [] });
    }

    // Populate the studentId field to get the student details
    await Mark.populate(marks, {
      path: "marks.studentId",
      select: "studentName",
    });

    // Extract relevant information for response
    const scores = marks.marks.map((m) => ({
      studentId: m.studentId,
      studentName: m.studentId ? m.studentId.studentName : null,
      testscore: m.testscore,
      examscore: m.examscore,
      marksObtained: m.testscore + m.examscore,
      comment: m.comment,
    }));

    res.status(200).json({ examId, subjectId, scores });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// const updateMark = async (req, res) => {
//   try {
//     const { examId, subjectId, testscore, examscore, marksObtained, comment } =
//       req.body;
//     const studentId = req.params.studentId;

//     const result = await Mark.updateOne(
//       {
//         "marks.studentId": studentId,
//         examId,
//         "marks.subjectId": subjectId,
//       },
//       {
//         $set: {
//           "marks.$[elem].testscore": testscore,
//           "marks.$[elem].examscore": examscore,
//           "marks.$[elem].marksObtained": marksObtained,
//           "marks.$[elem].comment": comment,
//         },
//       },
//       { arrayFilters: [{ "elem.studentId": studentId }] }
//     );

//     if (result.nModified === 0) {
//       return res.status(404).json({ error: "No matching records found" });
//     }

//     const updatedDocument = await Mark.findOne({
//       "marks.studentId": studentId,
//       examId,
//       "marks.subjectId": subjectId,
//     });

//     res
//       .status(200)
//       .json({ message: "Marks updated successfully", updatedDocument });
//   } catch (error) {
//     console.error("Error updating marks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const updateMarks = async (req, res) => {
  try {
    const { examId, subjectId, updates } = req.body;

    if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const results = [];
    const updatedDocuments = [];

    for (const update of updates) {
      const { studentId, testscore, examscore, marksObtained, comment } =
        update;

      const filter = {
        examId,
        "marks.studentId": studentId,
        "marks.subjectId": subjectId,
      };

      const updateOperation = {
        $set: {
          "marks.$[elem].testscore": testscore,
          "marks.$[elem].examscore": examscore,
          "marks.$[elem].marksObtained": marksObtained,
          "marks.$[elem].comment": comment,
        },
      };

      const options = {
        arrayFilters: [{ "elem.studentId": studentId }],
        new: true,
      };

      let updatedDoc = await Mark.findOneAndUpdate(
        filter,
        updateOperation,
        options
      );

      if (!updatedDoc) {
        // If the document doesn't exist, create a new mark
        const newMark = {
          subjectId,
          studentId,
          testscore,
          examscore,
          marksObtained,
          comment,
        };

        const filter = { examId };
        const update = { $push: { marks: newMark } };
        const options = { upsert: true, new: true };

        updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
      }

      updatedDocuments.push(updatedDoc);

      results.push({
        studentId,
        success: true,
      });
    }

    res.status(200).json({
      message: "Marks updated successfully",
      results,
      updatedDocuments,
    });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addSessionToMarks = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    const marksToUpdate = await Mark.find({ session: { $exists: false } });
    if (marksToUpdate.length === 0) {
      return res
        .status(404)
        .json({ message: "No marks found without session" });
    }

    for (const mark of marksToUpdate) {
      mark.session = sessionId;
      await mark.save();
    }

    res.status(200).json({
      message: "SessionId added to all marks",
      updated: marksToUpdate.length,
    });
  } catch (error) {
    console.error("Error adding sessionId to marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  saveMark,
  getMark,
  getMarkbyStudent,
  getMarkbyStudentwithoutsession,
  getScores,
  saveOrUpdateMarks,
  addSessionToMarks,
  updateMarks,
  getBroadsheet,
};
