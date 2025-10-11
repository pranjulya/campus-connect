import * as notificationService from '../services/notification.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getNotificationsForUser(
    req.user.id
  );

  res.json(notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markNotificationAsRead(
    req.params.notificationId,
    req.user.id
  );

  res.json(notification);
});
