import fs from 'fs';
import path from 'path';
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

describe('Whitespace-only text is rejected', () => {
  let mongoServer;
  let professor;
  let student;
  let course;
  let assignment;

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
      email: 'blank.prof@example.com',
      password: 'password123',
      role: 'professor',
    });
    student = await User.create({
      name: 'Stu',
      email: 'blank.stu@example.com',
      password: 'password123',
      role: 'student',
    });
    course = await Course.create({
      name: 'Blank 101',
      professor: professor._id,
      students: [student._id],
    });
    assignment = await Assignment.create({ title: 'A1', course: course._id });
  });

  const submissionsUrl = () =>
    `/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions`;

  it('does not accept a submission with only whitespace content', async () => {
    const res = await request(app)
      .post(submissionsUrl())
      .set('x-auth-token', token(student))
      .send({ content: '   \n ' });

    expect(res.statusCode).toEqual(400);
    expect(await Submission.countDocuments({})).toBe(0);
  });

  it('still accepts real content, and attachments without content', async () => {
    const withText = await request(app)
      .post(submissionsUrl())
      .set('x-auth-token', token(student))
      .send({ content: ' my answer ' });
    expect(withText.statusCode).toEqual(201);

    await Submission.deleteMany({});
    const withFile = await request(app)
      .post(submissionsUrl())
      .set('x-auth-token', token(student))
      .field('content', '  ')
      .attach('attachments', Buffer.from('file body'), 'essay.txt');
    expect(withFile.statusCode).toEqual(201);
    expect(withFile.body.attachments).toHaveLength(1);
    expect(withFile.body.attachments[0]).toMatch(/^uploads\/submissions\/.+-essay\.txt$/);
    fs.rmSync(path.join(process.cwd(), withFile.body.attachments[0]), { force: true });
  });

  it('rejects whitespace-only assignment titles and course names', async () => {
    const badAssignment = await request(app)
      .post(`/api/v1/courses/${course._id}/assignments`)
      .set('x-auth-token', token(professor))
      .send({ title: '   ' });
    expect(badAssignment.statusCode).toEqual(400);

    const badCourse = await request(app)
      .post('/api/v1/courses')
      .set('x-auth-token', token(professor))
      .send({ name: '   ' });
    expect(badCourse.statusCode).toEqual(400);

    const badRename = await request(app)
      .put(`/api/v1/courses/${course._id}`)
      .set('x-auth-token', token(professor))
      .send({ name: '  ' });
    expect(badRename.statusCode).toEqual(400);
  });
});
