import Submission from '../models/Submission.js';

export const create = (data) => Submission.create(data);

export const findByAssignmentId = (assignmentId) =>
  Submission.find({ assignment: assignmentId }).populate('student', ['name', 'email']);

export const findByAssignmentAndStudent = (assignmentId, studentId) =>
  Submission.findOne({ assignment: assignmentId, student: studentId });

export const findById = (id) =>
  Submission.findById(id).populate('student', ['name', 'email']);

export const updateById = (id, update) =>
  Submission.findByIdAndUpdate(id, update, { new: true });

export const deleteById = (id) => Submission.findByIdAndDelete(id);
