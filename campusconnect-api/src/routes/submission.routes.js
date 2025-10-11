import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  submitAssignment,
  getSubmissions,
  getSubmission,
  updateSubmission,
  reviewSubmission,
} from '../controllers/submission.controller.js';

const router = express.Router({ mergeParams: true });

const submissionIdSchema = {
  [Segments.PARAMS]: Joi.object({
    submissionId: Joi.string().hex().length(24).required(),
  }),
};

const createSubmissionSchema = {
  [Segments.BODY]: Joi.object({
    content: Joi.string(),
    attachments: Joi.array().items(Joi.string()),
  }).or('content', 'attachments'),
};

const reviewSubmissionSchema = {
  [Segments.BODY]: Joi.object({
    grade: Joi.number(),
    feedback: Joi.string(),
  }).or('grade', 'feedback'),
};

router.use(protect);

router
  .route('/')
  .get(getSubmissions)
  .post(authorizeRoles('student'), celebrate(createSubmissionSchema), submitAssignment);

router
  .route('/:submissionId')
  .get(celebrate(submissionIdSchema), getSubmission)
  .put(authorizeRoles('student'), celebrate({ ...submissionIdSchema, ...createSubmissionSchema }), updateSubmission);

router
  .route('/:submissionId/review')
  .patch(authorizeRoles('professor'), celebrate({ ...submissionIdSchema, ...reviewSubmissionSchema }), reviewSubmission);

export default router;
