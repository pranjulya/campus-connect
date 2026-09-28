import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';
import env from '../config/env.js';

/**
 * Read the JWT from the request.
 *
 * The preferred form is the standard `Authorization: Bearer <token>` header,
 * which is what the frontend sends. The legacy `x-auth-token` header is still
 * accepted for backward compatibility with older clients and scripts.
 */
export const extractToken = (req) => {
  const authHeader = req.header('authorization');

  if (authHeader) {
    const [scheme, value] = authHeader.trim().split(/\s+/);
    if (scheme?.toLowerCase() === 'bearer' && value) {
      return value;
    }
  }

  return req.header('x-auth-token') || null;
};

export const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const userId = decoded?.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: 'Token payload missing user information' });
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(401).json({ msg: 'User no longer exists' });
    }

    // Role comes from the database, not the token, so role changes take effect immediately.
    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'Insufficient permissions' });
  }

  next();
};
