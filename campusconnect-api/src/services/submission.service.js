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

export const submitAssignment = async (assignmentId, studentId, data) => {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  const course = await Course.findById(assignment.course);
  if (!course.students.includes(studentId)) {
    throw new AppError('You are not enrolled in this course', 403);
  }

  let submission = await Submission.findOne({
    assignment: assignmentId,
    student: studentId,
  });

  if (submission) {
    submission.content = data.content || submission.content;
    submission.attachments = data.attachments || submission.attachments;
  } else {
    submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      ...data,
    });
  }

  await submission.save();
  return submission;
};

export const getSubmissions = async (assignmentId, user) => {
  if (user.role === 'student') {
    return await Submission.find({
      assignment: assignmentId,
      student: user.id,
    });
  }
  return await Submission.find({ assignment: assignmentId });
};

export const getSubmissionById = async (submissionId, user) => {
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  if (
    user.role === 'student' &&
    submission.student.toString() !== user.id
  ) {
    throw new AppError('You are not authorized to view this submission', 403);
  }

  return submission;
};

export const reviewSubmission = async (submissionId, professorId, data) => {
  const submission = await Submission.findById(submissionId).populate({
    path: 'assignment',
    populate: {
      path: 'course',
    },
  });

  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  if (
    submission.assignment.course.professor.toString() !== professorId
  ) {
    throw new AppError('You are not authorized to review this submission', 403);
  }

  submission.grade = data.grade ?? submission.grade;
  submission.feedback = data.feedback ?? submission.feedback;
  submission.status = 'graded';

  await submission.save();
  return submission;
};
