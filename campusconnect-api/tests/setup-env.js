// Runs before each test file is loaded, so src/config/env.js sees these values
// when it is first imported (ESM imports are evaluated before test code runs).
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
