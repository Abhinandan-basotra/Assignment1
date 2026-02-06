import express from 'express';
import { getUser, login, register, logout } from '../controllers/auth.controllers.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/logout').post(logout);
router.route('/me').get(isAuthenticated, getUser);

export default router;