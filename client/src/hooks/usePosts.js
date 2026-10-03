import { useState, useEffect } from 'react';
import { getAllPosts } from '../api/postApi';

// Loads every post once. Used by the Blogs and About pages.
export default function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAllPosts()
      .then((res) => !cancelled && setPosts(res.data))
      .catch((err) => {
        console.error('Error fetching posts:', err);
        if (!cancelled) setError(err);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, setPosts, loading, error };
}
