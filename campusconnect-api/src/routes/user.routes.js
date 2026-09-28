import express from 'express';
import { getEnrolledCourses, getMe } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me/courses', protect, getEnrolledCourses);
router.get('/me', protect, getMe);

export default router;
