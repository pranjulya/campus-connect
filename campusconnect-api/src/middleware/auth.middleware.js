import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';
import env from '../config/env.js';
export const protect = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: 'Token payload missing user information' });
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(401).json({ msg: 'User no longer exists' });
    }

    req.user = { id: user.id, role: user.role };
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded.user;
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
