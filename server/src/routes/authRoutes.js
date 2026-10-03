import express from 'express';
import { googleSignIn, me, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', googleSignIn);
router.get('/me', me);
router.post('/logout', logout);

export default router;
