import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  getBlog,
  getBlogBySlug,
  updateBlog,
} from "../controller/blogController.js";

const router = express.Router();

//CREATE
router.post("/blog", createBlog);

router.get("/find/blog/:id", getBlog);
router.get("/blog/find-by-slug/:slug", getBlogBySlug);

//GET
// router.get("/find/:title", getProperties);

// router.get("/finds/:categories", getPropCategory);
//GET ALL

router.get("/blog", getAllBlog);

//UPDATE
router.put("/blog/:id", updateBlog);
//DELETE
router.delete("/blog/:id", deleteBlog);
//GET
export default router;
