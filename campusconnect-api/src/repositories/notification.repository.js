import Notification from '../models/Notification.js';

export const createMany = (notifications) => Notification.insertMany(notifications);

export const create = (notification) => Notification.create(notification);

export const findByUserWithGlobals = (userId) =>
  Notification.find({ $or: [{ user: userId }, { isGlobal: true }] })
    .sort({ createdAt: -1 })
    .populate('course', ['name'])
    .populate('assignment', ['title']);

export const markAsRead = (id, userId) =>
  Notification.findOneAndUpdate(
    { _id: id, $or: [{ user: userId }, { isGlobal: true }] },
    { isRead: true },
    { new: true }
  );

export const deleteByCourseId = (courseId) =>
  Notification.deleteMany({ course: courseId });

export const deleteByAssignmentId = (assignmentId) =>
  Notification.deleteMany({ assignment: assignmentId });
