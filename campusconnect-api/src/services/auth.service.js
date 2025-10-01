import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import * as userRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';

const signJwt = promisify(jwt.sign);
const TOKEN_EXPIRATION_SECONDS = 3600;

const buildTokenPayload = (userId) => ({
  user: {
    id: userId,
  },
});

export const register = async ({ name, email, password, role }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  const user = await userRepository.create({ name, email, password, role });

  const token = await signJwt(buildTokenPayload(user.id), process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION_SECONDS,
  });

  return { token };
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError('Invalid credentials', 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('Invalid credentials', 400);
  }

  const token = await signJwt(buildTokenPayload(user.id), process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION_SECONDS,
  });

  return { token };
};
