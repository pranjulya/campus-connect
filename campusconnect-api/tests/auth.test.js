import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Auth API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register an existing user', async () => {
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should login a registered user', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login an unregistered user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });


  it('should treat email as case-insensitive on login', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Case User',
        email: 'Case.User@Example.COM',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'case.user@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject registering the same email with different casing', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Case User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Case User 2',
        email: 'Duplicate@Example.COM',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });


  async function seedLegacyUser({ name, email, password, role = 'student' }) {
    // Bypass Mongoose setters so the stored casing matches pre-patch data.
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.default.hash(password, 10);
    await User.collection.insertOne({ name, email, password: hash, role });
  }

  it('allows login to a legacy mixed-case account with the original email', async () => {
    await seedLegacyUser({
      name: 'Legacy User',
      email: 'Legacy.User@Example.COM',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'Legacy.User@Example.COM',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('allows login to a legacy mixed-case account with different casing', async () => {
    await seedLegacyUser({
      name: 'Legacy User',
      email: 'Legacy.User@Example.COM',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'legacy.user@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects registering a case-variant of a legacy email', async () => {
    await seedLegacyUser({
      name: 'Legacy User',
      email: 'Legacy.User@Example.COM',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Dup User',
        email: 'legacy.user@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');

    const emails = await User.collection.find({}).project({ email: 1 }).toArray();
    expect(emails.map((u) => u.email)).toEqual(['Legacy.User@Example.COM']);
  });

  it('refuses login when multiple case-variant accounts already exist', async () => {
    await seedLegacyUser({
      name: 'Legacy A',
      email: 'Dup@Example.COM',
      password: 'password123',
    });
    await seedLegacyUser({
      name: 'Legacy B',
      email: 'dup@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'dup@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty(
      'message',
      'Multiple accounts match this email; contact support'
    );
    expect(res.body).not.toHaveProperty('token');
  });


  it('rejects registering when case-variant duplicates already exist', async () => {
    await seedLegacyUser({
      name: 'Legacy A',
      email: 'Dup@Example.COM',
      password: 'password123',
    });
    await seedLegacyUser({
      name: 'Legacy B',
      email: 'dup@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Another',
        email: 'DUP@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');

    const count = await User.collection.countDocuments({});
    expect(count).toEqual(2);
  });

  it('should store emails in lowercase', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Stored Case',
        email: 'Stored.Case@Example.COM',
        password: 'password123',
      });

    const user = await User.findOne({ email: 'stored.case@example.com' });
    expect(user).not.toBeNull();
    expect(user.email).toEqual('stored.case@example.com');
  });

});
