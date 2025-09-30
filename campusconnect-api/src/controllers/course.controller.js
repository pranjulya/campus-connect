import * as courseService from '../services/course.service.js';
import handleControllerError from '../utils/controllerErrorHandler.js';

export const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.user.id, req.body);
    res.status(201).json(course);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await courseService.getCourses();
    res.json(courses);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.json(course);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.user.id, req.body);
    res.json(course);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id, req.user.id);
    res.json({ msg: 'Course removed successfully' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const students = await courseService.enrollStudent(req.params.id, req.user.id);
    res.json(students);
  } catch (error) {
    handleControllerError(res, error);
  }
};
