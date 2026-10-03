import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 255 },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true, maxlength: 255 }, // display name
    // the account that owns the post (null for posts migrated from the old MySQL version)
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    // Vercel has no writable disk, so uploaded images are stored in MongoDB.
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    // same field names the React app already uses
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.image_url = ret.image?.contentType
          ? `/api/posts/${ret.id}/image?v=${new Date(ret.updated_at).getTime()}`
          : null;
        ret.author_id = ret.author_id ? ret.author_id.toString() : null;
        delete ret._id;
        delete ret.__v;
        delete ret.image; // never send raw image bytes inside JSON
        return ret;
      },
    },
  }
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
