import User from '../models/User.js';

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Exact-match lookup. Note: with schema `lowercase: true`, Mongoose lowercases
 * string filters, so this cannot find legacy mixed-case emails. Prefer
 * findAllByEmailInsensitive for auth.
 */
export const findByEmail = (email) => User.findOne({ email });

/**
 * Case-insensitive email match that returns every document, including legacy
 * mixed-case rows. Uses a RegExp so the schema lowercase setter cannot rewrite
 * the filter into a lowercase exact match that misses those rows.
 */
export const findAllByEmailInsensitive = (email) => {
  const normalized = String(email).trim();
  const pattern = new RegExp(`^${escapeRegExp(normalized)}$`, 'i');
  return User.find({ email: pattern });
};

export const create = (userData) => User.create(userData);

export const findById = (id) => User.findById(id);

export const findAllByRole = (role) => User.find({ role });
