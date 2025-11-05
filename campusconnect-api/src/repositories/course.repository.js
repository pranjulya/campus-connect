import Course from '../models/Course.js';

export const create = (courseData) => Course.create(courseData);

export const findAll = (options) => Course.paginate({}, options);

export const findById = (id) => Course.findById(id);

export const findByIdWithRelations = (id) =>
  Course.findById(id)
    .populate('professor', ['name', 'email'])
    .populate('students', ['name', 'email']);

export const updateById = (id, update) =>
  Course.findByIdAndUpdate(id, update, { new: true });

export const deleteById = (id) => Course.findByIdAndDelete(id);

export const addStudent = (courseId, studentId) =>
  Course.findByIdAndUpdate(
    courseId,
    { $addToSet: { students: studentId } },
    { new: true }
  );
