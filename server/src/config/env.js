import dotenv from 'dotenv';

dotenv.config();

// One place to read environment variables from.
export const env = {
  get mongoUri() {
    return process.env.MONGODB_URI;
  },
  get port() {
    return process.env.PORT || 5001;
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  get googleClientId() {
    return process.env.GOOGLE_CLIENT_ID;
  },
  get jwtSecret() {
    return process.env.JWT_SECRET;
  },
  // emails that get the "admin" role (can edit/delete any post)
  get adminEmails() {
    return (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  },
  // front-end origin(s); when set, state-changing requests from other origins are rejected
  get clientOrigins() {
    return (process.env.CLIENT_ORIGIN || '')
      .split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean);
  },
  sessionDays: 7,
};
