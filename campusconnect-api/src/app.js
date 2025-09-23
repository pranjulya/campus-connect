import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import logger from './config/logger.js';
const { globalErrorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan('combined', {
    stream: logger.stream,
  })
);

app.get('/', (req, res) => {
  res.send('Hello from CampusConnect API!');
});

// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/assignments', assignmentRoutes);

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
