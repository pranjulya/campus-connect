import AppError from '../utils/appError.js';
import * as courseRepository from '../repositories/course.repository.js';
import * as notificationService from './notification.service.js';

import { COURSE_NOT_FOUND, USER_NOT_AUTHORIZED, USER_ALREADY_ENROLLED } from '../utils/constants.js';

// ... (rest of the file)

const ensureCourseExists = async (courseId) => {
  const course = await courseRepository.findById(courseId);

  if (!course) {
    throw new AppError(COURSE_NOT_FOUND, 404);
  }

  return course;
};

const assertProfessorOwnership = (course, userId) => {
  if (course.professor?.toString() !== userId) {
    throw new AppError(USER_NOT_AUTHORIZED, 401);
  }
};

// ... (rest of the file)

export const getCourseById = async (courseId) => {
  const course = await courseRepository.findByIdWithRelations(courseId);

  if (!course) {
    throw new AppError(COURSE_NOT_FOUND, 404);
  }

  return course;
};

export const updateCourse = async (courseId, userId, { name, description }) => {
  const course = await ensureCourseExists(courseId);

  assertProfessorOwnership(course, userId);

  const updatedCourse = await courseRepository.updateById(courseId, {
    name,
    description,
  });

  if (!updatedCourse) {
    throw new AppError(COURSE_NOT_FOUND, 404);
  }

  // ... (rest of the function)
};

// ... (rest of the file)

export const enrollStudent = async (courseId, studentId) => {
  const course = await ensureCourseExists(courseId);

  const alreadyEnrolled = course.students.some(
    (student) => student.toString() === studentId
  );

  if (alreadyEnrolled) {
    throw new AppError(USER_ALREADY_ENROLLED, 400);
  }

  const updatedCourse = await courseRepository.addStudent(courseId, studentId);

  if (!updatedCourse) {
    throw new AppError(COURSE_NOT_FOUND, 404);
  }

  // ... (rest of the function)
};

