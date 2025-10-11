import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { register, login } from '../controllers/auth.controller.js';
import validate from '../middleware/validation.middleware.js';
import Joi from 'joi';

const router = express.Router();

const registerSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('student', 'professor', 'admin'),
  }),
};

const loginSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

router.post('/register', celebrate(registerSchema), register);
router.post('/login', celebrate(loginSchema), login);

export default router;
