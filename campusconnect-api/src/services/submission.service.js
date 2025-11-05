import AppError from '../utils/appError.js';
import * as submissionRepository from '../repositories/submission.repository.js';
import * as assignmentRepository from '../repositories/assignment.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';

const normalizeAttachments = (attachments) => {
  if (!attachments) {
    return [];
  }

  if (Array.isArray(attachments)) {
    return attachments.filter(Boolean);
  }

  return [attachments].filter(Boolean);
};

import { SUBMISSION_REQUIRES_CONTENT_OR_ATTACHMENTS, ASSIGNMENT_NOT_FOUND, COURSE_NOT_FOUND, USER_MUST_BE_ENROLLED_TO_SUBMIT, USER_NOT_AUTHORIZED, SUBMISSION_NOT_FOUND, SUBMISSION_ALREADY_EXISTS, USER_ROLE_NOT_PERMITTED } from '../utils/constants.js';

// ... (rest of the file)

const validateSubmissionPayload = ({ content, attachments } = {}) => {
  const normalizedAttachments = normalizeAttachments(attachments);

  if (!content && normalizedAttachments.length === 0) {
    throw new AppError(SUBMISSION_REQUIRES_CONTENT_OR_ATTACHMENTS, 400);
  }

  return { content, attachments: normalizedAttachments };
};

const ensureCourseAndAssignment = async (courseId, assignmentId) => {
  const assignment = await assignmentRepository.findById(assignmentId);

  if (!assignment || assignment.course?.toString() !== courseId) {
    throw new AppError(ASSIGNMENT_NOT_FOUND, 404);
  }

  const course = await courseRepository.findById(courseId);

  if (!course) {
    throw new AppError(COURSE_NOT_FOUND, 404);
  }

  return { assignment, course };
};

const ensureStudentEnrolled = (course, studentId) => {
  const students = course.students ?? [];
  const isEnrolled = students.some((student) => student.toString() === studentId);

  if (!isEnrolled) {
    throw new AppError(USER_MUST_BE_ENROLLED_TO_SUBMIT, 403);
  }
};

const ensureProfessorOwnership = (course, userId) => {
  if (course.professor?.toString() !== userId) {
    throw new AppError(USER_NOT_AUTHORIZED, 401);
  }
};

const ensureSubmissionBelongsToAssignment = (submission, assignmentId) => {
  if (!submission || submission.assignment?.toString() !== assignmentId) {
    throw new AppError(SUBMISSION_NOT_FOUND, 404);
  }
};

export const submitAssignment = async (
  courseId,
  assignmentId,
  studentId,
  payload
) => {
  // ... (rest of the function)

  if (existingSubmission) {
    throw new AppError(SUBMISSION_ALREADY_EXISTS, 400);
  }

  // ... (rest of the function)
};

export const getSubmissions = async (courseId, assignmentId, user) => {
  // ... (rest of the function)

  throw new AppError(USER_ROLE_NOT_PERMITTED, 403);
};

export const getSubmissionById = async (
  courseId,
  assignmentId,
  submissionId,
  user
) => {
  // ... (rest of the function)

  if (user.role === 'student') {
    if (submission.student?.toString() !== user.id) {
      throw new AppError(USER_NOT_AUTHORIZED, 401);
    }
    // ... (rest of the function)
  }

  throw new AppError(USER_ROLE_NOT_PERMITTED, 403);
};

export const updateSubmission = async (
  courseId,
  assignmentId,
  submissionId,
  studentId,
  payload
) => {
  // ... (rest of the function)

  if (submission.student?.toString() !== studentId) {
    throw new AppError(USER_NOT_AUTHORIZED, 401);
  }

  // ... (rest of the function)
};


export const reviewSubmission = async (
  courseId,
  assignmentId,
  submissionId,
  professorId,
  payload
) => {
  const { course } = await ensureCourseAndAssignment(courseId, assignmentId);
  ensureProfessorOwnership(course, professorId);

  const submission = await submissionRepository.findById(submissionId);
  ensureSubmissionBelongsToAssignment(submission, assignmentId);

  const updatePayload = {
    status: 'reviewed',
    reviewedAt: new Date(),
    reviewedBy: professorId,
  };

  if (Object.prototype.hasOwnProperty.call(payload, 'grade')) {
    updatePayload.grade = payload.grade;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'feedback')) {
    updatePayload.feedback = payload.feedback;
  }

  await submissionRepository.updateById(submissionId, updatePayload);

  return submissionRepository.findById(submissionId);
};
