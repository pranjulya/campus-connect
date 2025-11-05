import * as analyticsService from '../services/analytics.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const summary = await analyticsService.getSummary({ startDate, endDate });

  res.json(summary);
});
