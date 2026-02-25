// examRoutes.js
const express = require("express");
const passport = require("passport");
const verify = require("../middlewares/verifyToken");

const router = express.Router();
const { getClientIp } = require("../middlewares/ipgetter");

module.exports = router;
