import axios from 'axios';

// Requests go to /api on the SAME domain as the website. In development, the "proxy"
// field in package.json forwards them to the local server; on Vercel, client/vercel.json
// forwards them to the API project. Same-domain means the login cookie is first-party.
const client = axios.create({ baseURL: '/api' });

export default client;