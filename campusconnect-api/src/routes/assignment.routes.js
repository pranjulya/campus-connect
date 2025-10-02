import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignment.controller.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAssignments)
  .post(protect, authorizeRoles('professor'), createAssignment);
router
  .route('/:assignmentId')
  .get(getAssignment)
  .put(protect, authorizeRoles('professor'), updateAssignment)
  .delete(protect, authorizeRoles('professor'), deleteAssignment);

export default router;
