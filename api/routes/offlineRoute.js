const express = require("express");
const {
  submitExam,
  getExam,
  deleteExam,
  addSessionToExamWithoutSession,
} = require("../controller/offlineExamController");
const {
  addSessionToMarks,
  getMark,
  getMarkbyStudent,
  getMarkbyStudentwithoutsession,
  getScores,
  saveMark,
  saveOrUpdateMarks,

  getBroadsheet,
  updateMarks,
} = require("../controller/offMarkController");

const router = express.Router();

// CREATE routes
router.post("/create-exam", submitExam);
router.post("/addSessionToExamWithoutSession", addSessionToExamWithoutSession);
// router.post("/save-marks/:sessionId", saveMark);
router.post("/save-marks/:sessionId", saveMark);
router.get("/get-scores/:examName/:sessionId", getMark);

router.get("/get-scores-by-student/:studentId/:sessionId", getMarkbyStudent);
router.get("/get-scored-by-student/:studentId", getMarkbyStudentwithoutsession);
router.post("/add-session-to-marks", addSessionToMarks);
router.get("/get-exams/:sessionId", getExam);
router.get("/get-broadsheet/:examId/:sectionId/:tech", getBroadsheet);

router.get("/get-all-scores/:examId/:subjectId", getScores);

router.put("/update-all-marks", updateMarks);
// router.put("/update-marks/:studentId", updateMarks);
router.delete("/deleteexam/:examId", deleteExam);

module.exports = router;
