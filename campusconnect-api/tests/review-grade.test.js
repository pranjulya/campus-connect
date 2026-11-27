import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';
import Assignment from '../src/models/Assignment.js';
import Submission from '../src/models/Submission.js';

const token = (user) =>
  jwt.sign({ user: { id: user._id.toString(), role: user.role } }, process.env.JWT_SECRET);

describe('Review grade range', () => {
  let mongoServer;
  let professor;
  let submission;
  let reviewUrl;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Assignment.deleteMany({}),
      Submission.deleteMany({}),
    ]);
    professor = await User.create({
      name: 'Prof',
      email: 'grade.prof@example.com',
      password: 'password123',
      role: 'professor',
    });
    const student = await User.create({
      name: 'Stu',
      email: 'grade.stu@example.com',
      password: 'password123',
      role: 'student',
    });
    const course = await Course.create({
      name: 'Grades 101',
      professor: professor._id,
      students: [student._id],
    });
    const assignment = await Assignment.create({ title: 'A1', course: course._id });
    submission = await Submission.create({
      assignment: assignment._id,
      student: student._id,
      content: 'work',
    });
    reviewUrl = `/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions/${submission._id}/review`;
  });

  const review = (body) =>
    request(app).patch(reviewUrl).set('x-auth-token', token(professor)).send(body);

  it.each([-1, 100.5, 1e9, -0.01])('rejects grade %p', async (grade) => {
    const res = await review({ grade });
    expect(res.statusCode).toEqual(400);
    expect((await Submission.findById(submission._id)).grade).toBeUndefined();
  });

  it.each([0, 55.5, 100])('accepts grade %p', async (grade) => {
    const res = await review({ grade });
    expect(res.statusCode).toEqual(200);
    expect(res.body.grade).toBe(grade);
  });

  it('rejects a non-numeric or non-finite grade', async () => {
    expect((await review({ grade: 'A+' })).statusCode).toEqual(400);
    const raw = await request(app)
      .patch(reviewUrl)
      .set('x-auth-token', token(professor))
      .set('Content-Type', 'application/json')
      .send('{"grade": 1e999}');
    expect(raw.statusCode).toBeGreaterThanOrEqual(400);
  });
});
