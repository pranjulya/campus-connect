const express = require('express');
const { getEnrolledCourses } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/me/courses', protect, getEnrolledCourses);
router.get('/me', protect, getMe);

module.exports = router;
