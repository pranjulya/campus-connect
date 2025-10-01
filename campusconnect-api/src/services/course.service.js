import AppError from '../utils/appError.js';
import * as courseRepository from '../repositories/course.repository.js';

const ensureCourseExists = async (courseId) => {
  const course = await courseRepository.findById(courseId);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  return course;
};

const assertProfessorOwnership = (course, userId) => {
  if (course.professor?.toString() !== userId) {
    throw new AppError('User not authorized', 401);
  }
};

export const createCourse = (professorId, { name, description }) =>
  courseRepository.create({ name, description, professor: professorId });

export const getCourses = () => courseRepository.findAllWithProfessor();

export const getCourseById = async (courseId) => {
  const course = await courseRepository.findByIdWithRelations(courseId);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  return course;
};

export const updateCourse = async (courseId, userId, { name, description }) => {
  const course = await ensureCourseExists(courseId);

  assertProfessorOwnership(course, userId);

  const updatedCourse = await courseRepository.updateById(courseId, { name, description });

  if (!updatedCourse) {
    throw new AppError('Course not found', 404);
  }

  return updatedCourse;
};

export const deleteCourse = async (courseId, userId) => {
  const course = await ensureCourseExists(courseId);

  assertProfessorOwnership(course, userId);

  await courseRepository.deleteById(courseId);
};

export const enrollStudent = async (courseId, studentId) => {
  const course = await ensureCourseExists(courseId);

  const alreadyEnrolled = course.students.some(
    (student) => student.toString() === studentId
  );

  if (alreadyEnrolled) {
    throw new AppError('User already enrolled', 400);
  }

  const updatedCourse = await courseRepository.addStudent(courseId, studentId);

  if (!updatedCourse) {
    throw new AppError('Course not found', 404);
  }

  return updatedCourse.students;
};
