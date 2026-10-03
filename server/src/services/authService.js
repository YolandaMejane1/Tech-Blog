import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { env } from '../config/env.js';

const oauthClient = new OAuth2Client();

// Kept in an object so tests can replace it without calling Google.
export const google = {
  // Verifies the ID token Google gave the browser: signature, expiry, and that it was
  // issued for OUR client id. Returns the trusted profile.
  async verifyCredential(credential) {
    if (!env.googleClientId) throw new Error('GOOGLE_CLIENT_ID is not set');
    let payload;
    try {
      const ticket = await oauthClient.verifyIdToken({
        idToken: credential,
        audience: env.googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new ApiError(401, 'Invalid Google credential');
    }
    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new ApiError(401, 'Your Google email address is not verified');
    }
    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
    };
  },
};

// First sign-in creates the account (sign up); later sign-ins update it (sign in).
export const signInWithGoogle = async (credential) => {
  const profile = await google.verifyCredential(credential);
  try {
    return await User.findOneAndUpdate(
      { googleId: profile.googleId },
      {
        $set: {
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          lastLoginAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, 'An account with this email already exists');
    }
    throw error;
  }
};

export const getUserById = (id) => User.findById(id);

export const roleFor = (email) => (env.adminEmails.includes(email) ? 'admin' : 'user');

// what the front-end is allowed to see about a user
export const toPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  picture: user.picture || null,
  role: roleFor(user.email),
});
