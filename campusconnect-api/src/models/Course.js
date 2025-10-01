import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// Index courses by professor to speed up filtering by teaching user
courseSchema.index({ professor: 1 });

// Support future lookups by course name (e.g., auto-complete/search)
courseSchema.index({ name: 1 });

const Course = mongoose.model('Course', courseSchema);

export default Course;
