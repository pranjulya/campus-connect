import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import logger from '../config/logger.js';

export const createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is the professor of the course
        if (course.professor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const assignment = new Assignment({
            title,
            description,
            dueDate,
            course: courseId
        });

        await assignment.save();
        res.status(201).json(assignment);
    } catch (err) {
        logger.error('Error creating assignment', { err });
        res.status(500).send('Server error');
    }
};

export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.json(assignments);
    } catch (err) {
        logger.error('Error retrieving assignments', { err });
        res.status(500).send('Server error');
    }
};

export const getAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }
        res.json(assignment);
    } catch (err) {
        logger.error('Error retrieving assignment', { err });
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Assignment not found' });
        }
        res.status(500).send('Server error');
    }
};

export const updateAssignment = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        let assignment = await Assignment.findById(req.params.assignmentId);

        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        const course = await Course.findById(assignment.course);
        // Check if user is the professor of the course
        if (course.professor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        assignment = await Assignment.findByIdAndUpdate(req.params.assignmentId, { title, description, dueDate }, { new: true });

        res.json(assignment);
    } catch (err) {
        logger.error('Error updating assignment', { err });
        res.status(500).send('Server error');
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId);

        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        const course = await Course.findById(assignment.course);
        // Check if user is the professor of the course
        if (course.professor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Assignment.findByIdAndDelete(req.params.assignmentId);

        res.json({ msg: 'Assignment removed' });
    } catch (err) {
        logger.error('Error deleting assignment', { err });
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Assignment not found' });
        }
        res.status(500).send('Server error');
    }
};
