const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const {
  createBlog,
  deleteBlog,
  getAllBlog,
  getBlog,
  getBlogBySlug,
  updateBlog,
} = require("../controller/blogController");

const router = express.Router();

// S3 Client Setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

// Remove ACL
function multerS3NoAcl(options) {
  const storage = multerS3(options);
  const origGetS3Params = storage.getS3Params;
  storage.getS3Params = (file, cb) => {
    origGetS3Params.call(storage, file, (err, params) => {
      if (params.ACL) {
        delete params.ACL;
      }
      cb(err, params);
    });
  };
  return storage;
}

// Multer S3 Upload Config
const upload = multer({
  storage: multerS3NoAcl({
    s3,
    bucket: "edupros",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `blogger/${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// CREATE
router.post("/blog", upload.single("image"), createBlog);

router.get("/find/blog/:id", getBlog);
router.get("/blog/find-by-slug/:slug", getBlogBySlug);

// GET ALL
router.get("/blog", getAllBlog);

// UPDATE
router.put("/blog/:id", upload.single("image"), updateBlog);

// DELETE
router.delete("/blog/:id", deleteBlog);

module.exports = router;