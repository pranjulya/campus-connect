import Assignment from '../models/Assignment.js';

export const create = (assignmentData) => Assignment.create(assignmentData);

export const findByCourseId = (courseId) => Assignment.find({ course: courseId });

export const findById = (id) => Assignment.findById(id);

export const updateById = (id, update) =>
  Assignment.findByIdAndUpdate(id, update, { new: true });

export const deleteById = (id) => Assignment.findByIdAndDelete(id);
