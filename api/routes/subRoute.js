const express = require("express");
const {
  // addSessionToSubjectWithoutSession,
  createSubject,
  getSubjectsByTradeSection,
  deleteSubject,
  updateSubject,
  // getallSubject,
  // getStudentSubjects,
  // getSubjectsByClass,
  // updateSubject,
} = require("../controller/subController");
// const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-subject/:sessionId", createSubject);
// Get all subjects by trade section and session
router.get("/all/:tradeSectionId/:sessionId", getSubjectsByTradeSection);

// router.post(
//   "/addSessionToSubjectWithoutSession",
//   addSessionToSubjectWithoutSession
// );
// router.get("/get-subject", authenticateUser, getallSubject);

// // Get subject by class and session
// router.get("/get-subject/:classname/:sessionId", getSubjectsByClass);

// router.get("/get-student-subjects", authenticateUser, getStudentSubjects);
// router.put("/update-subject/:subjectId", updateSubject);
router.put("/update-subject/:subjectId", updateSubject);

router.delete("/delete-subject/:subjectId", deleteSubject);

module.exports = router;
