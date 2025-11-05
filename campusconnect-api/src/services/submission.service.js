import AppError from '../utils/appError.js';
import * as submissionRepository from '../repositories/submission.repository.js';
import * as assignmentRepository from '../repositories/assignment.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import * as analyticsService from './analytics.service.js';

const normalizeAttachments = (attachments) => {
  if (!attachments) {
    return [];
  }

  if (Array.isArray(attachments)) {
    return attachments.filter(Boolean);
  }

  return [attachments].filter(Boolean);
};

const validateSubmissionPayload = ({ content, attachments } = {}) => {
  const normalizedAttachments = normalizeAttachments(attachments);

  if (!content && normalizedAttachments.length === 0) {
    throw new AppError('Submission requires content or attachments', 400);
  }

  return { content, attachments: normalizedAttachments };
};

const ensureCourseAndAssignment = async (courseId, assignmentId) => {
  const assignment = await assignmentRepository.findById(assignmentId);

  if (!assignment || assignment.course?.toString() !== courseId) {
    throw new AppError('Assignment not found', 404);
  }

  const course = await courseRepository.findById(courseId);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  return { assignment, course };
};

const ensureStudentEnrolled = (course, studentId) => {
  const students = course.students ?? [];
  const isEnrolled = students.some((student) => student.toString() === studentId);

  if (!isEnrolled) {
    throw new AppError('User must be enrolled to submit', 403);
  }
};

const ensureProfessorOwnership = (course, userId) => {
  if (course.professor?.toString() !== userId) {
    throw new AppError('User not authorized', 401);
  }
};

const ensureSubmissionBelongsToAssignment = (submission, assignmentId) => {
  if (!submission || submission.assignment?.toString() !== assignmentId) {
    throw new AppError('Submission not found', 404);
  }
};

export const submitAssignment = async (
  courseId,
  assignmentId,
  studentId,
  payload
) => {
  const { course } = await ensureCourseAndAssignment(courseId, assignmentId);
  ensureStudentEnrolled(course, studentId);

  const existingSubmission = await submissionRepository.findByAssignmentAndStudent(
    assignmentId,
    studentId
  );

  if (existingSubmission) {
    throw new AppError('Submission already exists. Update the existing record instead.', 400);
  }

  const { content, attachments } = validateSubmissionPayload(payload);

  const submission = await submissionRepository.create({
    assignment: assignmentId,
    student: studentId,
    content,
    attachments,
  });

  const hydratedSubmission = await submissionRepository.findById(submission.id);

  await analyticsService.recordAssignmentSubmission({
    courseId,
    assignmentId,
    studentId,
  });

  return hydratedSubmission;
};

export const getSubmissions = async (courseId, assignmentId, user) => {
  const { course } = await ensureCourseAndAssignment(courseId, assignmentId);

  if (user.role === 'professor') {
    ensureProfessorOwnership(course, user.id);
    return submissionRepository.findByAssignmentId(assignmentId);
  }

  if (user.role === 'student') {
    ensureStudentEnrolled(course, user.id);
    const submission = await submissionRepository.findByAssignmentAndStudent(
      assignmentId,
      user.id
    );

    return submission ? [submission] : [];
  }

  throw new AppError('User role not permitted for this action', 403);
};

export const getSubmissionById = async (
  courseId,
  assignmentId,
  submissionId,
  user
) => {
  const { course } = await ensureCourseAndAssignment(courseId, assignmentId);
  const submission = await submissionRepository.findById(submissionId);
  ensureSubmissionBelongsToAssignment(submission, assignmentId);

  if (user.role === 'professor') {
    ensureProfessorOwnership(course, user.id);
    return submission;
  }

  if (user.role === 'student') {
    if (submission.student?.toString() !== user.id) {
      throw new AppError('User not authorized', 401);
    }
    ensureStudentEnrolled(course, user.id);
    return submission;
  }

  throw new AppError('User role not permitted for this action', 403);
};

export const updateSubmission = async (
  courseId,
  assignmentId,
  submissionId,
  studentId,
  payload
) => {
  const { course } = await ensureCourseAndAssignment(courseId, assignmentId);
  ensureStudentEnrolled(course, studentId);

  const submission = await submissionRepository.findById(submissionId);
  ensureSubmissionBelongsToAssignment(submission, assignmentId);

  if (submission.student?.toString() !== studentId) {
    throw new AppError('User not authorized', 401);
  }

  const { content, attachments } = validateSubmissionPayload(payload);

  await submissionRepository.updateById(submissionId, {
    content,
    attachments,
    status: 'submitted',
    grade: null,
    feedback: null,
    reviewedAt: null,
    reviewedBy: null,
  });

  return submissionRepository.findById(submissionId);
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
