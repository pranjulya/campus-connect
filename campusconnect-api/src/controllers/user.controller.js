const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

const getEnrolledCourses = asyncHandler(async (req, res) => {
  const courses = await userService.getEnrolledCourses(req.user.id);
  res.status(200).json(courses);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  res.status(200).json(user);
});

module.exports = { getEnrolledCourses, getMe };
