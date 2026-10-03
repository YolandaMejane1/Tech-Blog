import ApiError from '../utils/ApiError.js';
import { env } from '../config/env.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// Extra CSRF protection on top of sameSite cookies: state-changing requests that come
// from a browser page on another website are rejected. Active when CLIENT_ORIGIN is set.
export const originCheck = (req, res, next) => {
  const allowed = env.clientOrigins;
  const origin = req.headers.origin;
  if (allowed.length === 0 || SAFE_METHODS.has(req.method) || !origin) return next();
  if (allowed.includes(origin.replace(/\/$/, ''))) return next();
  next(new ApiError(403, 'Request origin not allowed'));
};
