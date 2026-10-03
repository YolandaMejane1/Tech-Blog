import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { getPostById } from '../api/postApi';
import { getImageSrc, handleImageError } from '../utils/image';

const PostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(postId);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="flex w-screen justify-center items-center min-h-screen bg-cover bg-center px-4" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1459278558918-f94278c0f022?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}>
      <div className="w-full max-w-3xl p-4 bg-white bg-opacity-5 shadow-lg border border-white backdrop-blur-md">
        {post.image_url && (
          <img
            src={getImageSrc(post)}
            onError={handleImageError}
            alt={post.title}
            className="w-full h-72 object-cover border-b border-white"
          />
        )}
        <h2 className="text-3xl font-bold text-left mt-6 text-white">{post.title}</h2>
        <p className="text-sm text-white mb-2">{moment(post.created_at).format('MMMM D, YYYY')}</p>
        <p className="text-white mt-4">{post.content}</p>
        <div className="text-sm text-white pt-20">By {post.author || 'Anonymous'}</div>
      </div>
    </div>
  );
};

export default PostView;
