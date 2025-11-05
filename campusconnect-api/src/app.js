import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { errors } from 'celebrate';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
import logger from './config/logger.js';
import { ensureUploadsDirs, getUploadsDir } from './config/upload.config.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();

const API_PREFIX = '/api';
const DEFAULT_API_VERSION = 'v1';
const apiBasePath = `${API_PREFIX}/${DEFAULT_API_VERSION}`;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());
app.use(xss());

ensureUploadsDirs();
app.use('/uploads', express.static(getUploadsDir()));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  morgan('combined', {
    stream: logger.stream,
  })
);

app.get('/', (req, res) => {
  res.send('Hello from CampusConnect API!');
});

// API v1 routes
const apiV1Router = express.Router();
apiV1Router.use('/auth', authLimiter, authRoutes);
apiV1Router.use('/courses/:courseId/assignments', assignmentRoutes);
apiV1Router.use('/courses', courseRoutes);
apiV1Router.use('/notifications', notificationRoutes);

app.use(apiBasePath, apiV1Router);

// Backward compatibility for clients using the non-versioned prefix
app.use(API_PREFIX, apiV1Router);

app.get(apiBasePath, (req, res) => {
  res.json({
    message: 'CampusConnect API v1',
    version: DEFAULT_API_VERSION,
  });
});

app.get(API_PREFIX, (req, res) => {
  res.json({
    message: 'CampusConnect API',
    availableVersions: [DEFAULT_API_VERSION],
    defaultVersion: DEFAULT_API_VERSION,
  });
});


// Celebrate error handler
app.use(errors());

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
