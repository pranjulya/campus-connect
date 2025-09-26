import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { protect } from '../src/middleware/auth.middleware.js';
import { AppError, globalErrorHandler } from '../src/middleware/error.middleware.js';

describe('Auth middleware', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  const setupApp = () => {
    const app = express();
    app.get('/protected', protect, (req, res) => {
      res.status(200).json({ user: req.user });
    });
    return app;
  };

  it('returns 401 when no token header is present', async () => {
    const app = setupApp();

    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ msg: 'No token, authorization denied' });
  });

  it('returns 401 when the token verification fails', async () => {
    const app = setupApp();

    const response = await request(app)
      .get('/protected')
      .set('x-auth-token', 'invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ msg: 'Token is not valid' });
  });

  it('allows the request through when the token is valid', async () => {
    const app = setupApp();
    const token = jwt.sign({ user: { id: 'user-123' } }, process.env.JWT_SECRET);

    const response = await request(app)
      .get('/protected')
      .set('x-auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { id: 'user-123' } });
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
