const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer to Upload to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "skillovia", // Replace with your actual S3 bucket name
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueFilename = `uploads/skills/${Date.now()}-${
        file.originalname
      }`;
      cb(null, uniqueFilename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB per file
});

module.exports = upload;
