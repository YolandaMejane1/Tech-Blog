import path from 'path';
import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// Images are kept in memory (Vercel's filesystem is read-only), then saved to MongoDB.
// Vercel also caps request bodies at about 4.5MB, so stay under that.
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const okExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const okMime = allowed.test(file.mimetype);
  if (okExt && okMime) return cb(null, true);
  cb(new ApiError(400, 'Only .jpg, .jpeg, and .png files are allowed'));
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_IMAGE_BYTES },
});

export default upload;
