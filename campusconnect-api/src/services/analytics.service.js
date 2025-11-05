import * as analyticsRepository from '../repositories/analytics.repository.js';
import logger from '../config/logger.js';

const buildDateFilter = ({ startDate, endDate } = {}) => {
  const match = {};
  const createdAt = {};

  if (startDate) {
    createdAt.$gte = startDate;
  }

  if (endDate) {
    createdAt.$lte = endDate;
  }

  if (Object.keys(createdAt).length > 0) {
    match.createdAt = createdAt;
  }

  return match;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    logger.warn('Invalid date received for analytics filter', { value });
    return null;
  }

  return parsed;
};

export const recordCourseEnrollment = async ({ courseId, studentId }) => {
  try {
    await analyticsRepository.create({
      type: 'course_enrollment',
      user: studentId,
      course: courseId,
    });
  } catch (error) {
    logger.error('Failed to record course enrollment activity', { error });
  }
};

export const recordAssignmentSubmission = async ({
  courseId,
  assignmentId,
  studentId,
}) => {
  try {
    await analyticsRepository.create({
      type: 'assignment_submission',
      user: studentId,
      course: courseId,
      assignment: assignmentId,
    });
  } catch (error) {
    logger.error('Failed to record assignment submission activity', { error });
  }
};

export const getSummary = async ({ startDate, endDate } = {}) => {
  const parsedStartDate = parseDate(startDate);
  const parsedEndDate = parseDate(endDate);

  const match = buildDateFilter({
    startDate: parsedStartDate,
    endDate: parsedEndDate,
  });

  const [totalEnrollments, totalSubmissions, enrollmentsByCourse, submissionsByAssignment, recentActivityDocs] = await Promise.all([
    analyticsRepository.countByType('course_enrollment', match),
    analyticsRepository.countByType('assignment_submission', match),
    analyticsRepository.aggregate([
      {
        $match: {
          type: 'course_enrollment',
          ...match,
          course: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          courseId: '$_id',
          courseName: '$course.name',
          count: 1,
        },
      },
      {
        $sort: { count: -1, courseName: 1 },
      },
    ]),
    analyticsRepository.aggregate([
      {
        $match: {
          type: 'assignment_submission',
          ...match,
          assignment: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$assignment',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'assignments',
          localField: '_id',
          foreignField: '_id',
          as: 'assignment',
        },
      },
      {
        $unwind: {
          path: '$assignment',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'assignment.course',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          assignmentId: '$_id',
          assignmentTitle: '$assignment.title',
          courseId: '$course._id',
          courseName: '$course.name',
          count: 1,
        },
      },
      {
        $sort: { count: -1, assignmentTitle: 1 },
      },
    ]),
    analyticsRepository.findRecent(10, match),
  ]);

  const recentActivity = recentActivityDocs.map((doc) => {
    const json = doc.toJSON({ virtuals: false });

    return {
      id: json._id,
      type: json.type,
      user: json.user
        ? {
            id: json.user._id,
            name: json.user.name,
            email: json.user.email,
            role: json.user.role,
          }
        : null,
      course: json.course
        ? {
            id: json.course._id,
            name: json.course.name,
          }
        : null,
      assignment: json.assignment
        ? {
            id: json.assignment._id,
            title: json.assignment.title,
          }
        : null,
      metadata: json.metadata ?? {},
      createdAt: json.createdAt,
    };
  });

  return {
    totals: {
      courseEnrollments: totalEnrollments,
      assignmentSubmissions: totalSubmissions,
    },
    enrollmentsByCourse,
    submissionsByAssignment,
    recentActivity,
  };
};
