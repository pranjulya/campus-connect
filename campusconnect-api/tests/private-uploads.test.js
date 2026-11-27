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
import { getSubmissionUploadsDir, ensureUploadsDirs } from '../src/config/upload.config.js';

const token = (user) =>
  jwt.sign({ user: { id: user._id.toString(), role: user.role } }, process.env.JWT_SECRET);

const mkUser = (name, role) =>
  User.create({
    name,
    email: `${name.toLowerCase()}.uploads@example.com`,
    password: 'password123',
    role,
  });

describe('Submission files are private', () => {
  let mongoServer;
  let professor;
  let otherProfessor;
  let admin;
  let student;
  let classmate;
  let course;
  let assignment;
  let submission;
  const filename = 'test-private-upload-1.txt';
  const storedPath = `uploads/submissions/${filename}`;
  const fileUrl = `/uploads/submissions/${filename}`;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    ensureUploadsDirs();
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
    [professor, otherProfessor, admin, student, classmate] = await Promise.all([
      mkUser('Prof', 'professor'),
      mkUser('Other', 'professor'),
      mkUser('Admin', 'admin'),
      mkUser('Stu', 'student'),
      mkUser('Mate', 'student'),
    ]);
    course = await Course.create({
      name: 'Files 101',
      professor: professor._id,
      students: [student._id, classmate._id],
    });
    assignment = await Assignment.create({ title: 'A1', course: course._id });
    submission = await Submission.create({
      assignment: assignment._id,
      student: student._id,
      content: 'see file',
      attachments: [storedPath],
    });
    fs.writeFileSync(path.join(getSubmissionUploadsDir(), filename), 'secret essay');
  });

  afterEach(() => {
    fs.rmSync(path.join(getSubmissionUploadsDir(), filename), { force: true });
  });

  it('requires a login', async () => {
    const res = await request(app).get(fileUrl);
    expect(res.statusCode).toEqual(401);
  });

  it.each([
    ['the submitting student', () => student],
    ['the course professor', () => professor],
    ['an admin', () => admin],
  ])('lets %s download it', async (_label, who) => {
    const res = await request(app).get(fileUrl).set('x-auth-token', token(who()));

    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('secret essay');
    expect(res.headers['content-disposition']).toMatch(/^attachment/);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it.each([
    ['a classmate', () => classmate],
    ["another course's professor", () => otherProfessor],
  ])('refuses %s', async (_label, who) => {
    const res = await request(app).get(fileUrl).set('x-auth-token', token(who()));
    expect(res.statusCode).toEqual(404);
    expect(res.text).not.toContain('secret essay');
  });

  it('404s for unknown files, files on disk with no submission, and traversal', async () => {
    fs.writeFileSync(path.join(getSubmissionUploadsDir(), 'orphan.txt'), 'x');
    try {
      for (const url of [
        '/uploads/submissions/nope.txt',
        '/uploads/submissions/orphan.txt',
        '/uploads/submissions/..%2F..%2Fpackage.json',
        '/uploads/submissions/.hidden',
      ]) {
        const res = await request(app).get(url).set('x-auth-token', token(admin));
        expect(res.statusCode).toEqual(404);
      }
    } finally {
      fs.rmSync(path.join(getSubmissionUploadsDir(), 'orphan.txt'), { force: true });
    }
  });

  it('404s when the submission exists but the file is gone from disk', async () => {
    fs.rmSync(path.join(getSubmissionUploadsDir(), filename), { force: true });
    const res = await request(app).get(fileUrl).set('x-auth-token', token(student));
    expect(res.statusCode).toEqual(404);
  });

  it('does not serve other /uploads paths statically any more', async () => {
    const res = await request(app).get(`/uploads/submissions/${filename}`);
    expect(res.statusCode).toEqual(401);
    const root = await request(app).get('/uploads/');
    expect(root.statusCode).toEqual(404);
  });

  it("does not let a student claim someone else's file on their own submission", async () => {
    await Submission.deleteMany({ student: classmate._id });
    const res = await request(app)
      .post(`/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions`)
      .set('x-auth-token', token(classmate))
      .send({ content: 'mine', attachments: [storedPath] });

    expect(res.statusCode).toEqual(201);
    expect(res.body.attachments).toEqual([]);
    const download = await request(app).get(fileUrl).set('x-auth-token', token(classmate));
    expect(download.statusCode).toEqual(404);
  });

  it('a file uploaded with a submission is downloadable by its owner only', async () => {
    await Submission.deleteMany({});
    const created = await request(app)
      .post(`/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions`)
      .set('x-auth-token', token(student))
      .field('content', 'with file')
      .attach('attachments', Buffer.from('uploaded body'), 'essay.txt');

    expect(created.statusCode).toEqual(201);
    const [stored] = created.body.attachments;
    expect(stored).toMatch(/^uploads\/submissions\/.+-essay\.txt$/);

    try {
      const own = await request(app).get(`/${stored}`).set('x-auth-token', token(student));
      expect(own.statusCode).toEqual(200);
      expect(own.text).toBe('uploaded body');

      const other = await request(app).get(`/${stored}`).set('x-auth-token', token(classmate));
      expect(other.statusCode).toEqual(404);

      // Resubmitting can keep the stored path but cannot add a path the student doesn't own.
      const updated = await request(app)
        .put(`/api/v1/courses/${course._id}/assignments/${assignment._id}/submissions/${created.body._id}`)
        .set('x-auth-token', token(student))
        .send({ content: 'again', attachments: [stored, storedPath] });
      expect(updated.statusCode).toEqual(200);
      expect(updated.body.attachments).toEqual([stored]);
    } finally {
      fs.rmSync(path.join(process.cwd(), stored), { force: true });
    }
  });
});
