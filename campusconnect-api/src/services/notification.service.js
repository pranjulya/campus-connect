import AppError from '../utils/appError.js';
import * as notificationRepository from '../repositories/notification.repository.js';
import * as userRepository from '../repositories/user.repository.js';

const buildNotificationPayload = ({
  user,
  title,
  message,
  type,
  course,
  assignment,
  link,
  isGlobal,
}) => ({
  user,
  title,
  message,
  type,
  course,
  assignment,
  link,
  isGlobal,
});

export const notifyUsers = async (userIds, payload) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  const notifications = userIds.map((user) =>
    buildNotificationPayload({ ...payload, user, isGlobal: false })
  );

  return notificationRepository.createMany(notifications);
};

export const notifyAllStudentsOfNewCourse = async (course) => {
  const students = await userRepository.findAllByRole('student');

  const payload = {
    title: `New course: ${course.name}`,
    message: course.description ?? 'A new course is now available.',
    type: 'course',
    course: course.id,
  };

  if (students?.length) {
    await notifyUsers(
      students.map((student) => student.id.toString()),
      payload
    );
    return;
  }

  await notificationRepository.create(
    buildNotificationPayload({ ...payload, isGlobal: true })
  );
};

export const notifyCourseStudents = async (course, payload) => {
  const studentIds = (course.students ?? []).map((id) => id.toString());

  if (studentIds.length === 0) {
    return [];
  }

  return notifyUsers(studentIds, payload);
};

export const getNotificationsForUser = (userId) =>
  notificationRepository.findByUserWithGlobals(userId);

import { NOTIFICATION_NOT_FOUND } from '../utils/constants.js';

// ... (rest of the file)

export const markNotificationAsRead = async (notificationId, userId) => {
  const updated = await notificationRepository.markAsRead(notificationId, userId);

  if (!updated) {
    throw new AppError(NOTIFICATION_NOT_FOUND, 404);
  }

  return updated;
};

export const cleanupCourseNotifications = (courseId) =>
  notificationRepository.deleteByCourseId(courseId);

export const cleanupAssignmentNotifications = (assignmentId) =>
  notificationRepository.deleteByAssignmentId(assignmentId);
