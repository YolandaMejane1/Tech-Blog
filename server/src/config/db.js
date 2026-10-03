import mongoose from 'mongoose';
import { env } from './env.js';

// Serverless platforms (Vercel) reuse a warm function between requests, so the
// connection is cached on `global` instead of reconnecting on every request.
const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!env.mongoUri) throw new Error('MONGODB_URI is not set');

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // let the next request retry
    throw error;
  }
  return cached.conn;
};

export default connectDB;
