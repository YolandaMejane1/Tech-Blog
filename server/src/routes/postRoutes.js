import express from 'express';
import upload from '../middleware/upload.js';
import validateObjectId from '../middleware/validateObjectId.js';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllPosts,
  getPostById,
  getPostImage,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';

const router = express.Router();

router.param('id', validateObjectId);

// reading is public; writing needs a signed-in user
router.route('/').get(getAllPosts).post(requireAuth, upload.single('image'), createPost);
router.get('/:id/image', getPostImage);
router
  .route('/:id')
  .get(getPostById)
  .put(requireAuth, upload.single('image'), updatePost)
  .delete(requireAuth, deletePost);

export default router;
