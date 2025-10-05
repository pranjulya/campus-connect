import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  markAsRead,
} from '../controllers/notification.controller.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getNotifications);
router.route('/:notificationId/read').patch(markAsRead);

export default router;
