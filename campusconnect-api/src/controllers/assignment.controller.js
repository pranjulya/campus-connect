import * as assignmentService from '../services/assignment.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.createAssignment(
    req.params.courseId,
    req.user.id,
    req.body
  );

  res.status(201).json(assignment);
});

export const getAssignments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const options = { page, limit };
  const assignments = await assignmentService.getAssignmentsByCourse(
    req.params.courseId,
    options
  );

  res.json(assignments);
});

export const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.getAssignmentById(
    req.params.assignmentId
  );

  res.json(assignment);
});

export const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.updateAssignment(
    req.params.assignmentId,
    req.user.id,
    req.body
  );

  res.json(assignment);
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  await assignmentService.deleteAssignment(req.params.assignmentId, req.user.id);

  res.json({ msg: 'Assignment removed' });
});
