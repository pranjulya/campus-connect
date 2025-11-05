import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';
import Assignment from '../src/models/Assignment.js';
import Submission from '../src/models/Submission.js';
import ActivityLog from '../src/models/ActivityLog.js';

const signToken = (user) => jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET);

describe('Analytics API', () => {
  let mongoServer;
  let professor;
  let student;
  let admin;
  let course;
  let assignment;
  let studentToken;
  let adminToken;

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
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Assignment.deleteMany({}),
      Submission.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);

    professor = await User.create({
      name: 'Professor Analytics',
      email: 'professor.analytics@example.com',
      password: 'password123',
      role: 'professor',
    });

    student = await User.create({
      name: 'Student Analytics',
      email: 'student.analytics@example.com',
      password: 'password123',
      role: 'student',
    });

    admin = await User.create({
      name: 'Admin Analytics',
      email: 'admin.analytics@example.com',
      password: 'password123',
      role: 'admin',
    });

    course = await Course.create({
      name: 'Analytics 101',
      description: 'Testing analytics logging',
      professor: professor._id,
      students: [],
    });

    assignment = await Assignment.create({
      title: 'Analytics Assignment',
      course: course._id,
    });

    studentToken = signToken(student);
    adminToken = signToken(admin);
  });

  it('captures enrollment and submission activities and exposes analytics summary', async () => {
    await request(app)
      .post(`/api/courses/${course._id}/enroll`)
      .set('x-auth-token', studentToken)
      .send();

    await request(app)
      .post(`/api/courses/${course._id}/assignments/${assignment._id}/submissions`)
      .set('x-auth-token', studentToken)
      .send({
        content: 'Analytics submission content',
      });

    const response = await request(app)
      .get('/api/analytics')
      .set('x-auth-token', adminToken)
      .expect(200);

    expect(response.body).toHaveProperty('totals');
    expect(response.body.totals).toMatchObject({
      courseEnrollments: 1,
      assignmentSubmissions: 1,
    });

    expect(Array.isArray(response.body.enrollmentsByCourse)).toBe(true);
    expect(Array.isArray(response.body.submissionsByAssignment)).toBe(true);
    expect(Array.isArray(response.body.recentActivity)).toBe(true);

    const enrollmentEntry = response.body.enrollmentsByCourse.find(
      (entry) => entry.courseId === course._id.toString()
    );
    const submissionEntry = response.body.submissionsByAssignment.find(
      (entry) => entry.assignmentId === assignment._id.toString()
    );

    expect(enrollmentEntry?.count).toBe(1);
    expect(submissionEntry?.count).toBe(1);

    const recentEnrollment = response.body.recentActivity.find(
      (activity) => activity.type === 'course_enrollment'
    );
    const recentSubmission = response.body.recentActivity.find(
      (activity) => activity.type === 'assignment_submission'
    );

    expect(recentEnrollment?.course?.id).toBe(course._id.toString());
    expect(recentSubmission?.assignment?.id).toBe(assignment._id.toString());
  });
});
