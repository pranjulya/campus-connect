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
  downloadSubmissionFile,
} from '../controllers/submission.controller.js';

const router = express.Router({ mergeParams: true });

// mergeParams exposes :courseId and :assignmentId from the parent routers too,
// so the params schema must validate (or at least allow) them.
const submissionIdSchema = {
  [Segments.PARAMS]: Joi.object({
    courseId: Joi.string().hex().length(24).required(),
    assignmentId: Joi.string().hex().length(24).required(),
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

// Mounted at /uploads/submissions so stored attachment paths keep working, behind auth.
export const submissionFilesRouter = express.Router();

submissionFilesRouter.get(
  '/:filename',
  protect,
  celebrate({ [Segments.PARAMS]: Joi.object({ filename: Joi.string().max(255).required() }) }),
  downloadSubmissionFile
);

export default router;
