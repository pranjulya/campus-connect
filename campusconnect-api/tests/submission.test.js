import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';
import Assignment from '../src/models/Assignment.js';
import Submission from '../src/models/Submission.js';
import jwt from 'jsonwebtoken';
import ActivityLog from '../src/models/ActivityLog.js';

describe('Submission API', () => {
  let mongoServer;
  let student, professor;
  let course;
  let assignment;
  let studentToken, professorToken;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    await ActivityLog.deleteMany({});

    professor = await User.create({
      name: 'Test Professor',
      email: 'professor@example.com',
      password: 'password123',
      role: 'professor',
    });

    student = await User.create({
      name: 'Test Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student',
    });

    course = await Course.create({
      name: 'Test Course',
      description: 'A test course',
      professor: professor._id,
      students: [student._id],
    });

    assignment = await Assignment.create({
      title: 'Test Assignment',
      course: course._id,
    });

    professorToken = jwt.sign({ user: { id: professor._id, role: 'professor' } }, process.env.JWT_SECRET);
    studentToken = jwt.sign({ user: { id: student._id, role: 'student' } }, process.env.JWT_SECRET);
  });

  it('should allow a student to submit an assignment', async () => {
    const res = await request(app)
      .post(`/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions`)
      .set('x-auth-token', studentToken)
      .send({
        content: 'This is my submission.',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'This is my submission.');
    expect(res.body).toHaveProperty('student', student._id.toString());
  });

  it('should allow a professor to review a submission', async () => {
    const submission = await Submission.create({
      assignment: assignment._id,
      student: student._id,
      content: 'Submission content',
    });

    const res = await request(app)
      .patch(`/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions/${submission._id}/review`)
      .set('x-auth-token', professorToken)
      .send({
        grade: 95,
        feedback: 'Excellent work!',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('grade', 95);
    expect(res.body).toHaveProperty('feedback', 'Excellent work!');
    expect(res.body).toHaveProperty('status', 'graded');
  });

  it('should not allow a student to review a submission', async () => {
    const submission = await Submission.create({
      assignment: assignment._id,
      student: student._id,
      content: 'Submission content',
    });

    const res = await request(app)
      .patch(`/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions/${submission._id}/review`)
      .set('x-auth-token', studentToken)
      .send({
        grade: 95,
        feedback: 'Excellent work!',
      });

    expect(res.statusCode).toEqual(403);
  });
});
