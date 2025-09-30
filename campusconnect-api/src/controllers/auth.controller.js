import * as authService from '../services/auth.service.js';
import handleControllerError from '../utils/controllerErrorHandler.js';

export const register = async (req, res) => {
  try {
    const authResponse = await authService.register(req.body);
    res.json(authResponse);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const authResponse = await authService.login(req.body);
    res.json(authResponse);
  } catch (error) {
    handleControllerError(res, error);
  }
};
