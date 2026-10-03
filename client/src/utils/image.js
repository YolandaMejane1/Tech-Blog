import fallbackImage from '../assets/nasa-Q1p7bh3SHj8-unsplash.jpg';

// image_url from the server is a path like /api/posts/<id>/image?v=...
export const getImageSrc = (post) => post.image_url || null;

// use as <img onError={handleImageError} />
export const handleImageError = (e) => {
  e.target.onerror = null; // avoid an endless loop if the fallback fails too
  e.target.src = fallbackImage;
};
