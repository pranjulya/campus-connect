import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
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

const createCourseSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
  }),
};

const updateCourseSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
  }).min(1),
};

const courseIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

const getCoursesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
  }),
};

router
  .route('/')
  .get(celebrate(getCoursesSchema), getCourses)
  .post(protect, authorizeRoles('professor'), celebrate(createCourseSchema), createCourse);
router
  .route('/:id')
  .get(celebrate(courseIdSchema), getCourse)
  .put(protect, authorizeRoles('professor'), celebrate(updateCourseSchema), updateCourse)
  .delete(protect, authorizeRoles('professor'), celebrate(courseIdSchema), deleteCourse);
router
  .route('/:id/enroll')
  .post(protect, authorizeRoles('student'), celebrate(courseIdSchema), enrollCourse);

export default router;
