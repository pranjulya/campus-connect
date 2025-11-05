import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { submissionUpload } from '../middleware/upload.middleware.js';
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

const attachmentsSchema = Joi.alternatives().try(
  Joi.array().items(Joi.string()),
  Joi.string()
);

const createSubmissionSchema = {
  [Segments.BODY]: Joi.object({
    content: Joi.string().allow('').optional(),
    attachments: attachmentsSchema.optional(),
  }),
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
  .post(
    authorizeRoles('student'),
    submissionUpload.array('attachments'),
    celebrate(createSubmissionSchema),
    submitAssignment
  );

router
  .route('/:submissionId')
  .get(celebrate(submissionIdSchema), getSubmission)
  .put(
    authorizeRoles('student'),
    submissionUpload.array('attachments'),
    celebrate({ ...submissionIdSchema, ...createSubmissionSchema }),
    updateSubmission
  );

router
  .route('/:submissionId/review')
  .patch(authorizeRoles('professor'), celebrate({ ...submissionIdSchema, ...reviewSubmissionSchema }), reviewSubmission);

export default router;
