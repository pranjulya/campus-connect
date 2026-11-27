import Assignment from '../models/Assignment.js';

export const create = (assignmentData) => Assignment.create(assignmentData);

export const findByCourseId = (courseId, options) =>
  Assignment.paginate({ course: courseId }, options);

export const findById = (id) => Assignment.findById(id);

export const updateById = (id, update) =>
  Assignment.findByIdAndUpdate(id, update, { new: true });

export const deleteById = (id) => Assignment.findByIdAndDelete(id);

export const findIdsByCourseId = async (courseId) =>
  (await Assignment.find({ course: courseId }).select('_id').lean()).map((doc) => doc._id);

export const deleteByCourseId = (courseId) => Assignment.deleteMany({ course: courseId });
