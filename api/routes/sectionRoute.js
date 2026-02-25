// routes/sectionRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSection,
  getAllSections,
  getTeachersBySection,
  getStudentsBySection,
  getStudentsByTech,
  deleteSection,
  getSectionById,
} = require("../controller/sectionController");

// POST /api/section
router.post("/", createSection);

// GET /api/section
// router.get("/", getAllSections);
router.get("/:sessionId", getAllSections);
// router.get("/:sectionId/teachers", getTeachersBySection);
router.get("/:sectionId/teachers/:sessionId", getTeachersBySection);
router.get("/one/:sectionId", getSectionById);

// router.get("/:sectionId/students", getStudentsBySection);
// routes/auth.js or student route
router.get("/:sectionId/students/:sessionId", getStudentsBySection);

router.get("/:sectionId/students/:tech", getStudentsByTech);
router.delete("/:sectionId", deleteSection);
module.exports = router;
