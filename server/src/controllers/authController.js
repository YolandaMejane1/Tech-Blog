import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import * as authService from '../services/authService.js';
import { setSessionCookie, clearSessionCookie } from '../services/sessionService.js';

// POST /api/auth/google  { credential }  -> sign up / sign in
export const googleSignIn = asyncHandler(async (req, res) => {
  const { credential } = req.body || {};
  if (typeof credential !== 'string' || credential.length < 20) {
    throw new ApiError(400, 'Missing Google credential');
  }
  const user = await authService.signInWithGoogle(credential);
  setSessionCookie(res, user._id);
  res.status(200).json({ user: authService.toPublicUser(user) });
});

// GET /api/auth/me  -> who is signed in (null if nobody)
export const me = (req, res) => {
  res.status(200).json({ user: req.user || null });
};

// POST /api/auth/logout
export const logout = (req, res) => {
  clearSessionCookie(res);
  res.status(200).json({ message: 'Signed out' });
};
