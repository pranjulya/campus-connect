import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import * as userRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';
import {
  AMBIGUOUS_EMAIL_ACCOUNTS,
  INVALID_CREDENTIALS,
  USER_ALREADY_EXISTS,
} from '../utils/constants.js';
import env from '../config/env.js';

const signJwt = promisify(jwt.sign);
const TOKEN_EXPIRATION_SECONDS = 3600;

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const buildTokenPayload = (userId) => ({
  user: {
    id: userId,
  },
});

const resolveUniqueUserByEmail = async (email) => {
  const matches = await userRepository.findAllByEmailInsensitive(email);

  if (matches.length > 1) {
    throw new AppError(AMBIGUOUS_EMAIL_ACCOUNTS, 409);
  }

  return matches[0] || null;
};

export const register = async ({ name, email, password, role }) => {
  const normalizedEmail = normalizeEmail(email);
  // Any case-insensitive match blocks registration — including legacy rows and
  // preexisting case-duplicate pairs. Do not create another variant.
  const existingMatches = await userRepository.findAllByEmailInsensitive(normalizedEmail);

  if (existingMatches.length > 0) {
    throw new AppError(USER_ALREADY_EXISTS, 400);
  }

  const user = await userRepository.create({
    name,
    email: normalizedEmail,
    password,
    role,
  });

  const token = await signJwt(buildTokenPayload(user.id), env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION_SECONDS,
  });

  return { token };
};

export const login = async ({ email, password }) => {
  const user = await resolveUniqueUserByEmail(email);

  if (!user) {
    throw new AppError(INVALID_CREDENTIALS, 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError(INVALID_CREDENTIALS, 400);
  }

  const token = await signJwt(buildTokenPayload(user.id), env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION_SECONDS,
  });

  return { token };
};
