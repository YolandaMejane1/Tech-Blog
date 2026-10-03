import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export const SESSION_COOKIE = 'session';
const ISSUER = 'tech-blog';

const secret = () => {
  if (!env.jwtSecret || env.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be set to a random string of at least 32 characters');
  }
  return env.jwtSecret;
};

export const signSession = (userId) =>
  jwt.sign({}, secret(), {
    subject: String(userId),
    issuer: ISSUER,
    algorithm: 'HS256',
    expiresIn: `${env.sessionDays}d`,
  });

// returns the user id, or throws ApiError(401)
export const verifySession = (token) => {
  try {
    const payload = jwt.verify(token, secret(), { issuer: ISSUER, algorithms: ['HS256'] });
    return payload.sub;
  } catch (error) {
    if (error.message.startsWith('JWT_SECRET')) throw error; // misconfiguration, not a bad token
    throw new ApiError(401, 'Session is invalid or expired');
  }
};

// httpOnly: JavaScript in the page can't read the cookie (protects against XSS token theft)
// sameSite=lax: the browser won't send it on cross-site POST/PUT/DELETE (protects against CSRF)
export const cookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  path: '/',
});

export const setSessionCookie = (res, userId) =>
  res.cookie(SESSION_COOKIE, signSession(userId), {
    ...cookieOptions(),
    maxAge: env.sessionDays * 24 * 60 * 60 * 1000,
  });

export const clearSessionCookie = (res) => res.clearCookie(SESSION_COOKIE, cookieOptions());
