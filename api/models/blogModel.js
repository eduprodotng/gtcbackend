// api/models/blogModel.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    excerpt: { type: String },
    date: { type: String },
    readTime: { type: String },
    author: { type: String },
    color: { type: String },
    categories: { type: [String] },
    content: { type: Array },
    image: { type: String }, // AWS S3 image URL
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);