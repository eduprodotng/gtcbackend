const express = require("express");
const {
  getPsybyStudent,
  getScores,
  savePsy,
  updateMark,
  updateMarks,
} = require("../controller/psyController");

const verify = require("../middlewares/verifyToken");

const router = express.Router();

//CREATE route

router.post("/save-psy/:sessionId", savePsy);

router.get(
  "/get-psy-by-student/:studentId/:sessionId",
  verify,
  getPsybyStudent
);

router.get("/get-all-psy/:examId", getScores);

router.put("/update-all-psy/", updateMarks);

router.put("/update-marks/:studentId", updateMark);

module.exports = router;
