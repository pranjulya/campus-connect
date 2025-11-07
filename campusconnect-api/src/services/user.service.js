const User = require('../models/User');
const Course = require('../models/Course');

const getEnrolledCourses = async (userId) => {
  const courses = await Course.find({ students: userId });
  return courses;
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};

module.exports = { getEnrolledCourses, getMe };
