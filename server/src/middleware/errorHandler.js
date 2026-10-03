import multer from 'multer';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Single place that turns any error into a JSON response.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 4MB or smaller' : err.message;
    return res.status(400).json({ message });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({
    message: 'Something went wrong',
    ...(env.isProduction ? {} : { error: err.message }),
  });
};
