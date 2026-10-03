// Local development entry point (`npm run dev`). On Vercel, api/index.js is used instead.
import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});
