import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
} from '../controllers/course.controller.js';

const router = express.Router();

router
  .route('/')
  .get(getCourses)
  .post(protect, authorizeRoles('professor'), createCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorizeRoles('professor'), updateCourse)
  .delete(protect, authorizeRoles('professor'), deleteCourse);
router
  .route('/:id/enroll')
  .post(protect, authorizeRoles('student'), enrollCourse);

export default router;
