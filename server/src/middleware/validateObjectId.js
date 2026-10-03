import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

// Router param handler: rejects malformed ids with a 404 before touching the DB.
const validateObjectId = (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return next(new ApiError(404, 'Post not found'));
  next();
};

export default validateObjectId;
