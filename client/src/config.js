// Base URL of the server (no trailing slash), e.g. https://tech-blog-api.vercel.app
// Set REACT_APP_API_BASE_URL in client/.env locally, or in the Vercel project settings.
export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');
