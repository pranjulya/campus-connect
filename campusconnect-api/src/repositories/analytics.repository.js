import ActivityLog from '../models/ActivityLog.js';

export const create = (payload) => ActivityLog.create(payload);

export const countByType = (type, filters = {}) =>
  ActivityLog.countDocuments({ type, ...filters });

export const aggregate = (pipeline) => ActivityLog.aggregate(pipeline);

export const findRecent = (limit = 10, filters = {}) =>
  ActivityLog.find(filters)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', ['name', 'email', 'role'])
    .populate('course', ['name'])
    .populate('assignment', ['title']);
