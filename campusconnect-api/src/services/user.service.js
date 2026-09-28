import User from '../models/User.js';
import Course from '../models/Course.js';

export const getEnrolledCourses = async (userId) => {
  const courses = await Course.find({ students: userId });
  return courses;
};

export const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};
