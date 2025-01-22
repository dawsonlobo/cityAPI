import express from 'express';
import { generateOtp, verifyOtp } from '../controllers/authController';

const router = express.Router();

// Route to generate OTP
router.post('/generate-otp', generateOtp);

// Route to verify OTP and get JWT
router.post('/verify-otp', verifyOtp);

export default router;
