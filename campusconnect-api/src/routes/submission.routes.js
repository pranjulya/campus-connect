import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  submitAssignment,
  getSubmissions,
  getSubmission,
  updateSubmission,
  reviewSubmission,
} from '../controllers/submission.controller.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getSubmissions)
  .post(authorizeRoles('student'), submitAssignment);

router
  .route('/:submissionId')
  .get(getSubmission)
  .put(authorizeRoles('student'), updateSubmission);

router
  .route('/:submissionId/review')
  .patch(authorizeRoles('professor'), reviewSubmission);

export default router;
