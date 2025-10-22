import * as submissionService from '../services/submission.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const submitAssignment = asyncHandler(async (req, res) => {
  const submission = await submissionService.submitAssignment(
    req.params.assignmentId,
    req.user.id,
    req.body
  );
  res.status(201).json(submission);
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await submissionService.getSubmissions(
    req.params.assignmentId,
    req.user
  );
  res.json(submissions);
});

export const getSubmission = asyncHandler(async (req, res) => {
  const submission = await submissionService.getSubmissionById(
    req.params.submissionId,
    req.user
  );
  res.json(submission);
});

export const reviewSubmission = asyncHandler(async (req, res) => {
  const submission = await submissionService.reviewSubmission(
    req.params.submissionId,
    req.user.id,
    req.body
  );
  res.json(submission);
});
