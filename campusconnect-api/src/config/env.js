import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid';

const { error } = dotenv.config();

if (error && error.code !== 'ENOENT') {
  throw error;
}

const env = cleanEnv(
  process.env,
  {
    NODE_ENV: str({ default: 'development', choices: ['development', 'test', 'production'] }),
    PORT: port({ default: 3000 }),
    JWT_SECRET: str({ devDefault: 'dev-secret-key' }),
  },
  { strict: true }
);

export const getMongoUri = () =>
  cleanEnv(process.env, { MONGO_URI: str() }, { strict: true }).MONGO_URI;

export default env;
