import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { protect, extractToken } from '../src/middleware/auth.middleware.js';
import { AppError, globalErrorHandler } from '../src/middleware/error.middleware.js';
import User from '../src/models/User.js';

describe('Auth middleware', () => {
  let mongoServer;
  let user;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    user = await User.create({
      name: 'Middleware User',
      email: 'middleware@example.com',
      password: 'password123',
      role: 'student',
    });
  });

  const setupApp = () => {
    const app = express();
    app.get('/protected', protect, (req, res) => {
      res.status(200).json({ user: req.user });
    });
    return app;
  };

  const validToken = () =>
    jwt.sign({ user: { id: user._id.toString() } }, process.env.JWT_SECRET);

  it('returns 401 when no token header is present', async () => {
    const response = await request(setupApp()).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ msg: 'No token, authorization denied' });
  });

  it('returns 401 when the token verification fails', async () => {
    const response = await request(setupApp())
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ msg: 'Token is not valid' });
  });

  it('accepts a valid token in the Authorization: Bearer header', async () => {
    const response = await request(setupApp())
      .get('/protected')
      .set('Authorization', `Bearer ${validToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { id: user._id.toString(), role: 'student' } });
  });

  it('still accepts the legacy x-auth-token header', async () => {
    const response = await request(setupApp())
      .get('/protected')
      .set('x-auth-token', validToken());

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { id: user._id.toString(), role: 'student' } });
  });

  it('returns 401 when the user in the token no longer exists', async () => {
    const token = validToken();
    await User.deleteMany({});

    const response = await request(setupApp())
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ msg: 'User no longer exists' });
  });

  it('extractToken ignores non-Bearer Authorization schemes', () => {
    const req = { header: (name) => ({ authorization: 'Basic abc' })[name] };
    expect(extractToken(req)).toBeNull();
  });
});

describe('globalErrorHandler middleware', () => {
  const setupApp = (handler) => {
    const app = express();
    app.get('/test', handler);
    app.use(globalErrorHandler);
    return app;
  };

  it('formats known AppError instances', async () => {
    const app = setupApp((req, res, next) => {
      next(new AppError('Resource not found', 404));
    });

    const response = await request(app).get('/test');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'fail',
      message: 'Resource not found',
    });
  });

  it('defaults to a 500 response for unexpected errors', async () => {
    const app = setupApp((req, res, next) => {
      next(new Error('Unexpected failure'));
    });

    const response = await request(app).get('/test');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Unexpected failure',
    });
  });

  it('marks AppError instances as operational', () => {
    const error = new AppError('Bad request', 400);

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });
});
