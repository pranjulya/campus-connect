import * as courseService from '../services/course.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.user.id, req.body);
  res.status(201).json(course);
});

export const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const options = { page, limit, populate: { path: 'professor', select: 'name email' } };
  const courses = await courseService.getCourses(options);
  res.json(courses);
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  res.json(course);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.user.id, req.body);
  res.json(course);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id, req.user.id);
  res.json({ msg: 'Course removed successfully!' });
});

export const enrollCourse = asyncHandler(async (req, res) => {
  const students = await courseService.enrollStudent(req.params.id, req.user.id);
  res.json(students);
});
