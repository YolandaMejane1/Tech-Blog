import ApiError from '../utils/ApiError.js';
import { SESSION_COOKIE, verifySession, clearSessionCookie } from '../services/sessionService.js';
import { getUserById, toPublicUser } from '../services/authService.js';

// Runs on every /api request. If there's a valid session cookie, sets req.user;
// otherwise the visitor is simply anonymous (reading posts needs no login).
export const attachUser = async (req, res, next) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return next();

  try {
    const user = await getUserById(verifySession(token));
    if (user) {
      req.user = toPublicUser(user);
    } else {
      clearSessionCookie(res); // account no longer exists
    }
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      clearSessionCookie(res); // expired or tampered cookie
      return next();
    }
    next(error);
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Please sign in to continue'));
  next();
};
