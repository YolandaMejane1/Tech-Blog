import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../api/postApi';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(id);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      title,
      content,
    };

    try {
      await updatePost(id, updatedPost);
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error.response?.data?.message || 'Could not update the post');
    }
  };

  return (
    <div className="flex w-screen justify-center items-center min-h-screen bg-cover bg-center px-4" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1459278558918-f94278c0f022?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}>
      <div className="w-screen max-w-lg p-8 bg-white bg-opacity-5 backdrop-blur-sm shadow-xl border border-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-medium text-white" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 p-2 w-full border border-white bg-transparent text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-white" htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 p-2 w-full border border-white bg-transparent text-white"
              rows="5"
              required
            />
          </div>
          <button type="submit" className="bg-white text-black py-2 px-4 w-full hover:bg-gray-300">Update Post</button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
