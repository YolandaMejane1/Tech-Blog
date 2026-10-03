import * as postService from '../services/postService.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getAllPosts = asyncHandler(async (req, res) => {
  res.status(200).json(await postService.listPosts());
});

export const getPostById = asyncHandler(async (req, res) => {
  res.status(200).json(await postService.getPost(req.params.id));
});

export const getPostImage = asyncHandler(async (req, res) => {
  const image = await postService.getPostImage(req.params.id);
  res.set('Content-Type', image.contentType);
  // the URL changes whenever the post is updated (?v=...), so hard caching is safe
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(image.data);
});

export const createPost = asyncHandler(async (req, res) => {
  res.status(201).json(await postService.createPost(req.body, req.file, req.user));
});

export const updatePost = asyncHandler(async (req, res) => {
  res.status(200).json(await postService.updatePost(req.params.id, req.body, req.file, req.user));
});

export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id, req.user);
  res.status(200).json({ message: 'Post deleted successfully' });
});
