import Course from '../models/Course.js';
import User from '../models/User.js';
import logger from '../config/logger.js';

export const createCourse = async (req, res) => {
    try {
        const { name, description } = req.body;
        const professor = req.user.id;

        const course = new Course({
            name,
            description,
            professor
        });

        await course.save();
        res.status(201).json(course);
    } catch (err) {
        logger.error('Error creating course', { err });
        res.status(500).send('Server error');
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('professor', ['name', 'email']);
        res.json(courses);
    } catch (err) {
        logger.error('Error retrieving courses', { err });
        res.status(500).send('Server error');
    }
};

export const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('professor', ['name', 'email']).populate('students', ['name', 'email']);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        logger.error('Error retrieving course', { err });
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).send('Server error');
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { name, description } = req.body;
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is the professor of the course
        if (course.professor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        course = await Course.findByIdAndUpdate(req.params.id, { name, description }, { new: true });

        res.json(course);
    } catch (err) {
        logger.error('Error updating course', { err });
        res.status(500).send('Server error');
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is the professor of the course
        if (course.professor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Course removed' });
    } catch (err) {
        logger.error('Error deleting course', { err });
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).send('Server error');
    }
};

export const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is already enrolled
        if (course.students.includes(req.user.id)) {
            return res.status(400).json({ msg: 'User already enrolled' });
        }

        course.students.push(req.user.id);
        await course.save();

        res.json(course.students);
    } catch (err) {
        logger.error('Error enrolling in course', { err });
        res.status(500).send('Server error');
    }
};
