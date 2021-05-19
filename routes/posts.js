// Absolute imports
import express from "express";

// Relative imports
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// localhost:5000/posts
// bakepedia.netlify.app/posts
router.get("/", getPosts);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

export default router;
