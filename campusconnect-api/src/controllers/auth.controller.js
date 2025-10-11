import * as authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const authResponse = await authService.register(req.body);
  res.json(authResponse);
});

export const login = asyncHandler(async (req, res) => {
  const authResponse = await authService.login(req.body);
  res.json(authResponse);
});
