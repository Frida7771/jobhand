import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import passport from './middleware/passport.js';

// Routers
import jobRouter from './routes/jobsRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

// Middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create app
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());

// Logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security + Parsing
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(passport.initialize());

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME || '',
  api_key: process.env.CLOUD_API_KEY || '',
  api_secret: process.env.CLOUD_API_SECRET || '',
});

// Test routes
app.get('/api', (_req, res) => {
  res.json({ msg: 'API is working' });
});
app.get('/api/v1', (_req, res) => {
  res.json({ msg: 'API v1 is working' });
});
app.get('/', (_req, res) => {
  res.send('Hello World');
});
app.get('/api/v1/test', (_req, res) => {
  res.json({ msg: 'test route' });
});

// Routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);

// 404
app.use('*', (_req, res) => {
  res.status(404).json({ msg: 'not found' });
});

// Global error handler
app.use(errorHandlerMiddleware);

// Server
const port = process.env.PORT || 5100;

(async () => {
  try {
    if (!process.env.MONGO_URL) throw new Error('Missing MONGO_URL');
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
