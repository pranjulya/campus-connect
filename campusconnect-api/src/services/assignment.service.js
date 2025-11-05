import AppError from '../utils/appError.js';
import * as assignmentRepository from '../repositories/assignment.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import * as notificationService from './notification.service.js';

const ensureCourseOwnership = async (courseId, userId) => {
  const course = await courseRepository.findById(courseId);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.professor?.toString() !== userId) {
    throw new AppError('User not authorized', 401);
  }

  return course;
};

const ensureAssignmentExists = async (assignmentId) => {
  const assignment = await assignmentRepository.findById(assignmentId);

  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  return assignment;
};

export const createAssignment = async (courseId, userId, assignmentData) => {
  const course = await ensureCourseOwnership(courseId, userId);

  const assignment = await assignmentRepository.create({
    ...assignmentData,
    course: courseId,
  });

  await notificationService.notifyCourseStudents(course, {
    title: `New assignment: ${assignment.title}`,
    message: assignment.description ?? 'A new assignment has been posted.',
    type: 'assignment',
    course: courseId,
    assignment: assignment.id,
  });

  return assignment;
};

export const getAssignmentsByCourse = (courseId, options) =>
  assignmentRepository.findByCourseId(courseId, options);

export const getAssignmentById = (assignmentId) => ensureAssignmentExists(assignmentId);

export const updateAssignment = async (assignmentId, userId, updateData) => {
  const assignment = await ensureAssignmentExists(assignmentId);

  await ensureCourseOwnership(assignment.course, userId);

  const updatedAssignment = await assignmentRepository.updateById(
    assignmentId,
    updateData
  );

  if (!updatedAssignment) {
    throw new AppError('Assignment not found', 404);
  }

  const course = await courseRepository.findById(assignment.course);

  if (course) {
    await notificationService.notifyCourseStudents(course, {
      title: `Updated assignment: ${updatedAssignment.title}`,
      message: 'Assignment details have been updated.',
      type: 'assignment',
      course: assignment.course,
      assignment: assignmentId,
    });
  }

  return updatedAssignment;
};

export const deleteAssignment = async (assignmentId, userId) => {
  const assignment = await ensureAssignmentExists(assignmentId);

  await ensureCourseOwnership(assignment.course, userId);

  await assignmentRepository.deleteById(assignmentId);
  await notificationService.cleanupAssignmentNotifications(assignmentId);
};
