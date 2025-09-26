import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

describe('Course API Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let courseId;

  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({
        name: 'Test Course',
        description: 'This is a test course',
        instructor: 'Instructor ID',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    courseId = res.body._id;
  });

  it('should get all courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get a course by ID', async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', courseId);
  });

  it('should update a course', async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .send({
        name: 'Updated Test Course',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Test Course!');
  });

  it('should delete a course', async () => {
    const res = await request(app).delete(`/api/courses/${courseId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Course deleted successfully!');
  });

  it('should enroll a user in a course', async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/enroll`)
      .send({ userId: 'User ID' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User enrolled successfully!');
  });
});
