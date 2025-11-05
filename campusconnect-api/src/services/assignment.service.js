import AppError from '../utils/appError.js';
import * as assignmentRepository from '../repositories/assignment.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import * as notificationService from './notification.service.js';

import { COURSE_NOT_FOUND, USER_NOT_AUTHORIZED, ASSIGNMENT_NOT_FOUND } from '../utils/constants.js';

// ... (rest of the file)

const ensureCourseOwnership = async (courseId, userId) => {
  const course = await courseRepository.findById(courseId);

  if (!course) {
    throw new AppError(COURSE_NOT_FOUND, 404);
  }

  if (course.professor?.toString() !== userId) {
    throw new AppError(USER_NOT_AUTHORIZED, 401);
  }

  return course;
};

const ensureAssignmentExists = async (assignmentId) => {
  const assignment = await assignmentRepository.findById(assignmentId);

  if (!assignment) {
    throw new AppError(ASSIGNMENT_NOT_FOU ND, 404);
  }

  return assignment;
};

// ... (rest of the file)

export const updateAssignment = async (assignmentId, userId, updateData) => {
  const assignment = await ensureAssignmentExists(assignmentId);

  await ensureCourseOwnership(assignment.course, userId);

  const updatedAssignment = await assignmentRepository.updateById(
    assignmentId,
    updateData
  );

  if (!updatedAssignment) {
    throw new AppError(ASSIGNMENT_NOT_FOUND, 404);
  }

  // ... (rest of the function)
};

export const deleteAssignment = async (assignmentId, userId) => {
  const assignment = await ensureAssignmentExists(assignmentId);

  await ensureCourseOwnership(assignment.course, userId);

  await assignmentRepository.deleteById(assignmentId);
  await notificationService.cleanupAssignmentNotifications(assignmentId);
};
