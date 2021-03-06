// Relative imports
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// Route handlers

// Get Posts
// TODO: add JSDoc
export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

// Create Post
// TODO: add JSDoc
export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    authorId: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

// Update Post
// TODO: add JSDoc
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  // Validate post with specified id exists
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No posts found with specified id");

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );

  res.json(updatedPost);
};

// Delete Post
// TODO: add JSDoc
export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  // Validate post with specified id exists
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No posts found with specified id");

  await PostMessage.findByIdAndRemove(_id);

  res.json({ message: `Successfully deleted post with id ${_id}` });
};

// Like Post
// TODO: add JSDoc
export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  // Validate if user is authenticated
  if (!req.userId)
    return res.json({ message: "Unauthenticated... Please log in." });

  // Validate post with specified id exists
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No posts found with specified id");

  const post = await PostMessage.findById(_id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    // User likes the post
    post.likes.push(req.userId);
  } else {
    // User dislikes the post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const likedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(likedPost);
};
