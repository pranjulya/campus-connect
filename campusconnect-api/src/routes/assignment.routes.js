import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
    createAssignment,
    getAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment
 } from '../controllers/assignment.controller.js';
import submissionRoutes from './submission.routes.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAssignments).post(protect, createAssignment);

router.use('/:assignmentId/submissions', submissionRoutes);

router.route('/:assignmentId').get(getAssignment).put(protect, updateAssignment).delete(protect, deleteAssignment);

export default router;
