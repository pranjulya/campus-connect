import * as notificationService from '../services/notification.service.js';
import handleControllerError from '../utils/controllerErrorHandler.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(
      req.user.id
    );

    res.json(notifications);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markNotificationAsRead(
      req.params.notificationId,
      req.user.id
    );

    res.json(notification);
  } catch (error) {
    handleControllerError(res, error);
  }
};
