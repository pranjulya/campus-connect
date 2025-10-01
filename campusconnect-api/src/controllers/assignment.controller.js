import * as assignmentService from '../services/assignment.service.js';
import handleControllerError from '../utils/controllerErrorHandler.js';

export const createAssignment = async (req, res) => {
  try {
    const assignment = await assignmentService.createAssignment(
      req.params.courseId,
      req.user.id,
      req.body
    );

    res.status(201).json(assignment);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await assignmentService.getAssignmentsByCourse(
      req.params.courseId
    );

    res.json(assignments);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getAssignment = async (req, res) => {
  try {
    const assignment = await assignmentService.getAssignmentById(
      req.params.assignmentId
    );

    res.json(assignment);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await assignmentService.updateAssignment(
      req.params.assignmentId,
      req.user.id,
      req.body
    );

    res.json(assignment);
  } catch (error) {
    handleControllerError(res, error);
  }

};

export const deleteAssignment = async (req, res) => {
  try {
    await assignmentService.deleteAssignment(req.params.assignmentId, req.user.id);

    res.json({ msg: 'Assignment removed' });
  } catch (error) {
    handleControllerError(res, error);
  }
}
};
