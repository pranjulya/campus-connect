import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';

const signToken = (user) =>
  jwt.sign({ user: { id: user._id.toString() } }, process.env.JWT_SECRET);

describe('Course API Endpoints', () => {
  let mongoServer;
  let professor;
  let student;
  let professorToken;
  let studentToken;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), Course.deleteMany({})]);

    professor = await User.create({
      name: 'Course Professor',
      email: 'course.professor@example.com',
      password: 'password123',
      role: 'professor',
    });
    student = await User.create({
      name: 'Course Student',
      email: 'course.student@example.com',
      password: 'password123',
      role: 'student',
    });

    professorToken = signToken(professor);
    studentToken = signToken(student);
  });

  const createCourse = (overrides = {}) =>
    Course.create({
      name: 'Existing Course',
      description: 'Seeded course',
      professor: professor._id,
      students: [],
      ...overrides,
    });

  it('lets a professor create a course (Authorization: Bearer)', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({ name: 'Test Course', description: 'This is a test course' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('professor', professor._id.toString());
  });

  it('rejects course creation without a token', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .send({ name: 'Test Course' });

    expect(res.statusCode).toEqual(401);
  });

  it('rejects course creation by a student', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Test Course' });

    expect(res.statusCode).toEqual(403);
  });

  it('lists courses with pagination', async () => {
    await createCourse();

    const res = await request(app).get('/api/v1/courses');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.docs)).toBe(true);
    expect(res.body.docs).toHaveLength(1);
  });

  it('gets a course by ID', async () => {
    const course = await createCourse();

    const res = await request(app).get(`/api/v1/courses/${course._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', course._id.toString());
  });

  it('lets the owning professor update a course (legacy x-auth-token header)', async () => {
    const course = await createCourse();

    const res = await request(app)
      .put(`/api/v1/courses/${course._id}`)
      .set('x-auth-token', professorToken)
      .send({ name: 'Updated Test Course' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Test Course');
  });

  it('lets the owning professor delete a course', async () => {
    const course = await createCourse();

    const res = await request(app)
      .delete(`/api/v1/courses/${course._id}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('msg', 'Course removed successfully!');
    expect(await Course.findById(course._id)).toBeNull();
  });

  it('enrolls a student in a course', async () => {
    const course = await createCourse();

    const res = await request(app)
      .post(`/api/v1/courses/${course._id}/enroll`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([student._id.toString()]);
  });

  it('returns the current user and their courses from /users/me', async () => {
    await createCourse({ students: [student._id] });

    const me = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(me.statusCode).toEqual(200);
    expect(me.body).toHaveProperty('email', 'course.student@example.com');
    expect(me.body).not.toHaveProperty('password');

    const courses = await request(app)
      .get('/api/v1/users/me/courses')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(courses.statusCode).toEqual(200);
    expect(courses.body).toHaveLength(1);
  });
});
