import client from './client';

export const getAllPosts = () => client.get('/posts');
export const getPostById = (id) => client.get(`/posts/${id}`);
export const createPost = (postData) => client.post('/posts', postData);
export const updatePost = (id, updatedData) => client.put(`/posts/${id}`, updatedData);
export const deletePost = (id) => client.delete(`/posts/${id}`);
