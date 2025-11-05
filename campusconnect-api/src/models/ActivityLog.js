import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['course_enrollment', 'assignment_submission'],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ type: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
