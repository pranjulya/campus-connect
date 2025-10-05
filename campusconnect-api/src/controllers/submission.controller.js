import * as submissionService from '../services/submission.service.js';
import handleControllerError from '../utils/controllerErrorHandler.js';

export const submitAssignment = async (req, res) => {
  try {
    const submission = await submissionService.submitAssignment(
      req.params.courseId,
      req.params.assignmentId,
      req.user.id,
      req.body
    );

    res.status(201).json(submission);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const submissions = await submissionService.getSubmissions(
      req.params.courseId,
      req.params.assignmentId,
      req.user
    );

    res.json(submissions);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getSubmission = async (req, res) => {
  try {
    const submission = await submissionService.getSubmissionById(
      req.params.courseId,
      req.params.assignmentId,
      req.params.submissionId,
      req.user
    );

    res.json(submission);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const submission = await submissionService.updateSubmission(
      req.params.courseId,
      req.params.assignmentId,
      req.params.submissionId,
      req.user.id,
      req.body
    );

    res.json(submission);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const reviewSubmission = async (req, res) => {
  try {
    const submission = await submissionService.reviewSubmission(
      req.params.courseId,
      req.params.assignmentId,
      req.params.submissionId,
      req.user.id,
      req.body
    );

    res.json(submission);
  } catch (error) {
    handleControllerError(res, error);
  }
};
