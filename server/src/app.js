import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { attachUser } from './middleware/auth.js';
import { originCheck } from './middleware/originCheck.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import asyncHandler from './middleware/asyncHandler.js';

const app = express();

// No CORS on purpose: the browser only talks to this API through the front-end's own
// domain (a proxy), so cookies stay first-party and other websites cannot call the API.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use(originCheck);

// make sure MongoDB is connected before any /api route runs
app.use(
  '/api',
  asyncHandler(async (req, res, next) => {
    await connectDB();
    next();
  })
);
app.use('/api', attachUser);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
