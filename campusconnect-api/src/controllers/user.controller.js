import asyncHandler from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

export const getEnrolledCourses = asyncHandler(async (req, res) => {
  const courses = await userService.getEnrolledCourses(req.user.id);
  res.status(200).json(courses);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.status(200).json(user);
});
