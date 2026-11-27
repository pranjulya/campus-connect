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

describe('Deleting a course or assignment removes what hangs off it', () => {
  let mongoServer;
  let professor;
  let student;
  let course;
  let assignment;
  let otherAssignment;

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
      email: 'cascade.prof@example.com',
      password: 'password123',
      role: 'professor',
    });
    student = await User.create({
      name: 'Stu',
      email: 'cascade.stu@example.com',
      password: 'password123',
      role: 'student',
    });
    course = await Course.create({
      name: 'Cascade 101',
      professor: professor._id,
      students: [student._id],
    });
    assignment = await Assignment.create({ title: 'A1', course: course._id });
    otherAssignment = await Assignment.create({ title: 'A2', course: course._id });
    await Submission.create({ assignment: assignment._id, student: student._id, content: 'one' });
    await Submission.create({
      assignment: otherAssignment._id,
      student: student._id,
      content: 'two',
    });
  });

  it('deleting an assignment deletes its submissions only', async () => {
    const res = await request(app)
      .delete(`/api/v1/courses/${course._id}/assignments/${assignment._id}`)
      .set('x-auth-token', token(professor));

    expect(res.statusCode).toBeLessThan(300);
    expect(await Submission.countDocuments({ assignment: assignment._id })).toBe(0);
    expect(await Submission.countDocuments({ assignment: otherAssignment._id })).toBe(1);
  });

  it('deleting a course deletes its assignments and their submissions', async () => {
    const otherCourse = await Course.create({ name: 'Keep me', professor: professor._id });
    const keptAssignment = await Assignment.create({ title: 'Kept', course: otherCourse._id });
    await Submission.create({ assignment: keptAssignment._id, student: student._id, content: 'k' });

    const res = await request(app)
      .delete(`/api/v1/courses/${course._id}`)
      .set('x-auth-token', token(professor));

    expect(res.statusCode).toEqual(200);
    expect(await Assignment.countDocuments({ course: course._id })).toBe(0);
    expect(await Submission.countDocuments({ assignment: { $in: [assignment._id, otherAssignment._id] } })).toBe(0);
    expect(await Assignment.countDocuments({ _id: keptAssignment._id })).toBe(1);
    expect(await Submission.countDocuments({ assignment: keptAssignment._id })).toBe(1);

    const listed = await request(app).get(`/api/v1/courses/${course._id}/assignments`);
    expect(listed.body.docs ?? listed.body).toHaveLength(0);
  });
});
