import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { protect } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  markAsRead,
} from '../controllers/notification.controller.js';

const router = express.Router();

const notificationIdSchema = {
  [Segments.PARAMS]: Joi.object({
    notificationId: Joi.string().hex().length(24).required(),
  }),
};

router.use(protect);

router.route('/').get(getNotifications);
router.route('/:notificationId/read').patch(celebrate(notificationIdSchema), markAsRead);

export default router;
