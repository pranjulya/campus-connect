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

describe("A student's access to their own submission", () => {
  let mongoServer;
  let professor;
  let student;
  let classmate;
  let course;
  let assignment;
  let submission;

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
      email: 'own.prof@example.com',
      password: 'password123',
      role: 'professor',
    });
    student = await User.create({
      name: 'Stu',
      email: 'own.stu@example.com',
      password: 'password123',
      role: 'student',
    });
    classmate = await User.create({
      name: 'Mate',
      email: 'own.mate@example.com',
      password: 'password123',
      role: 'student',
    });
    course = await Course.create({
      name: 'Own 101',
      professor: professor._id,
      students: [student._id, classmate._id],
    });
    assignment = await Assignment.create({ title: 'A1', course: course._id });
    submission = await Submission.create({
      assignment: assignment._id,
      student: student._id,
      content: 'first draft',
    });
  });

  const url = () =>
    `/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions/${submission._id}`;

  it('lets the student read their own submission', async () => {
    const res = await request(app).get(url()).set('x-auth-token', token(student));

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'first draft');
  });

  it('lets the student resubmit, which resets the review', async () => {
    const res = await request(app)
      .put(url())
      .set('x-auth-token', token(student))
      .send({ content: 'second draft' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('content', 'second draft');
    expect(res.body).toHaveProperty('status', 'submitted');
  });

  it("still keeps a classmate out of someone else's submission", async () => {
    const read = await request(app).get(url()).set('x-auth-token', token(classmate));
    expect(read.statusCode).toEqual(401);

    const write = await request(app)
      .put(url())
      .set('x-auth-token', token(classmate))
      .send({ content: 'hijacked' });
    expect(write.statusCode).toEqual(401);
    expect((await Submission.findById(submission._id)).content).toBe('first draft');
  });
});
