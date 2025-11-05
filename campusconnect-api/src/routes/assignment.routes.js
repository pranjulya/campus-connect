import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignment.controller.js';
import submissionRoutes from './submission.routes.js';

const router = express.Router({ mergeParams: true });

const courseIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    courseId: Joi.string().hex().length(24).required(),
  }),
};

const assignmentIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    courseId: Joi.string().hex().length(24).required(),
    assignmentId: Joi.string().hex().length(24).required(),
  }),
};

const createAssignmentSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    dueDate: Joi.date(),
  }),
};

const updateAssignmentSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    dueDate: Joi.date(),
  }).min(1),
};

const getAssignmentsSchema = {
  [Segments.PARAMS]: courseIdParamSchema[Segments.PARAMS],
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
  }),
};

router
  .route('/')
  .get(celebrate(getAssignmentsSchema), getAssignments)
  .post(protect, authorizeRoles('professor'), celebrate(createAssignmentSchema), createAssignment);

router.use('/:assignmentId/submissions', celebrate({ [Segments.PARAMS]: assignmentIdParamSchema[Segments.PARAMS] }), submissionRoutes);

router
  .route('/:assignmentId')
  .get(celebrate(assignmentIdParamSchema), getAssignment)
  .put(protect, authorizeRoles('professor'), celebrate({ ...assignmentIdParamSchema, ...updateAssignmentSchema }), updateAssignment)
  .delete(protect, authorizeRoles('professor'), celebrate(assignmentIdParamSchema), deleteAssignment);

export default router;
