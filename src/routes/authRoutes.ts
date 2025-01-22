import express from 'express';
import AuthController from '../controllers/authContoller';
import { isAuthenticated, validateRegistration } from '../middleware/authMiddleware';

const router = express.Router();

// Auth routes
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', isAuthenticated, AuthController.logout);
router.get('/profile', isAuthenticated, AuthController.getProfile);

export default router;