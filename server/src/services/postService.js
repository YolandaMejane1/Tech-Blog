// All database logic for posts lives here, so controllers only deal with HTTP.
import Post from '../models/Post.js';
import ApiError from '../utils/ApiError.js';
import { canModifyPost } from '../utils/permissions.js';

const toImage = (file) => (file ? { data: file.buffer, contentType: file.mimetype } : undefined);

const findOrThrow = async (id, projection) => {
  const post = await Post.findById(id).select(projection);
  if (!post) throw new ApiError(404, 'Post not found');
  return post;
};

export const listPosts = () => Post.find().select('-image.data').sort({ created_at: 1 });

export const getPost = (id) => findOrThrow(id, '-image.data');

export const getPostImage = async (id) => {
  const post = await findOrThrow(id, 'image');
  if (!post.image?.data) throw new ApiError(404, 'Image not found');
  return post.image;
};

export const createPost = ({ title, content, author }, file, user) =>
  Post.create({
    title,
    content,
    author: author?.trim() || user.name, // display name; defaults to the account name
    author_id: user.id,
    image: toImage(file),
  });

export const updatePost = async (id, { title, content, author }, file, user) => {
  const post = await findOrThrow(id);
  if (!canModifyPost(user, post)) throw new ApiError(403, 'You can only edit your own posts');
  post.title = title || post.title;
  post.content = content || post.content;
  post.author = author || post.author;
  if (file) post.image = toImage(file); // keep the old image if no new one was sent
  return post.save();
};

export const deletePost = async (id, user) => {
  const post = await findOrThrow(id, 'author_id');
  if (!canModifyPost(user, post)) throw new ApiError(403, 'You can only delete your own posts');
  await post.deleteOne();
};
