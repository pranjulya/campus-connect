import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    enrollCourse
 } from '../controllers/course.controller.js';

const router = express.Router();

router.route('/').get(getCourses).post(protect, createCourse);
router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);
router.route('/:id/enroll').post(protect, enrollCourse);

export default router;
