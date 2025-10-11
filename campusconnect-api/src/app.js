import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());
app.use(xss());

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

// Routes 
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/assignments', assignmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Celebrate error handler
app.use(errors());

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
