import Course from '../models/Course.js';

export const create = (courseData) => Course.create(courseData);

export const findAllWithProfessor = () =>
  Course.find().populate('professor', ['name', 'email']);

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
