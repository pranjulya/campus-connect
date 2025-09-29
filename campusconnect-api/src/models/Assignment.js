import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  dueDate: {
    type: Date,
  },
});

// Compound index accelerates per-course queries and optional due date sorting
assignmentSchema.index({ course: 1, dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
