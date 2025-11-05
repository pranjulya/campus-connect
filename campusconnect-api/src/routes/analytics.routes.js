import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { getAnalyticsSummary } from '../controllers/analytics.controller.js';

const router = express.Router();

const analyticsQuerySchema = {
  [Segments.QUERY]: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
  }).with('endDate', 'startDate'),
};

router.use(protect, authorizeRoles('admin', 'professor'));

router.route('/').get(celebrate(analyticsQuerySchema), getAnalyticsSummary);

export default router;
