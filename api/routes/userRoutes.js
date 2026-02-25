const express = require("express");
const {
  updateUser,
  changeAppearanceMode,
  changeNotificationType,
  getProfileByUserId,
  profilePhotoUpload,
  profilePhotoUploadS3,
  updateBio,
  changePassword,
  nearByUsers,
  nearByUsersByAddress,
  getBasiceProfileByUserId,
  getBasiceProfileByUserName,
  generateReferralCode,
  getReferredUsers,
  getUserNotifications,
  createStripeAccount,
  deleteStripeAccount,
  generateStripeAccountLink,
  processSplitPayment,
  updateStripeAccount,
  getUserStripeAccount,
  compareSparkTokens,
} = require("../controller/userController");
const router = express.Router();
const verify = require("../middlewares/verifyToken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { getClientIp } = require("../middlewares/ipgetter");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

//const uploads3 = require('../upload/index');

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//      const uploadDir = '/uploads/profile';

//      callback(null, __dirname + uploadDir);
//   },
//   filename: function (req, file, callback) {
//      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//      const filename = uniqueSuffix + path.extname(file.originalname);
//      const filePath = path.join(__dirname + '/uploads/profile', filename); // Construct the file path

//      // Store the file path in req
//      if (!req.filePaths) {
//         req.filePaths = null;
//      }
//      req.filePaths = filePath;

//      callback(null, filename);
//   }
// });

// const upload = multer({ storage: storage })

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer storage with S3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "skillovia", // Your S3 bucket name
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `profile/${uniqueSuffix}${path.extname(
        file.originalname
      )}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false);
    }
    cb(null, true);
  },
});

router.put("/update/:id", verify, updateUser);
router.put("/settings/appearance", verify, changeAppearanceMode);
router.put("/settings/notification", verify, changeNotificationType);

router.get("/profile/:id", verify, getProfileByUserId);
router.get("/basic/profile/:id", verify, getBasiceProfileByUserId);
router.put(
  "/profile/upload",
  verify,
  upload.single("photo"),
  profilePhotoUpload
);
router.post("/compare-spark-tokens", verify, compareSparkTokens);

//router.put('/profile/upload/aws', verify, uploads3.single('photo'), profilePhotoUploadS3);
router.put("/profile/update/bio", verify, updateBio);
router.put("/change/password", verify, changePassword);
router.get("/people/within/:address", verify, nearByUsersByAddress);
router.get("/people/nearby/:lat/:lon/:radius", verify, nearByUsers);
router.get("/searchuser/:name", verify, getBasiceProfileByUserName);
router.put("/generate/referralcode", verify, generateReferralCode);
router.get("/get/myreferred/:code", verify, getReferredUsers);
router.get("/get/notifications", verify, getUserNotifications);
router.post("/stripe/create/connected/account", verify, createStripeAccount);
router.delete("/delete/connected/account/:id", verify, deleteStripeAccount);
router.post(
  "/stripe/connected/account/link",
  verify,
  generateStripeAccountLink
);

router.post("/stripe/payment/intent", verify, processSplitPayment);
router.put("/stripe/update/account", verify, updateStripeAccount);
router.get("/stripe/get/account/:userId", verify, getUserStripeAccount);

module.exports = router;
