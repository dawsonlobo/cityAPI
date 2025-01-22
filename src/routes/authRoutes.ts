import express from 'express';
import { generateOtp, verifyOtp } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /auth/generate-otp:
 *   post:
 *     tags: ['Auth']
 *     summary: Generate OTP for user authentication
 *     description: This endpoint generates a one-time password (OTP) for the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone number for which to generate the OTP.
 *                 example: ''
 *     responses:
 *       200:
 *         description: OTP generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'OTP sent successfully.'
 *       400:
 *         description: Invalid input, missing phone number or invalid format.
 *       500:
 *         description: Internal server error.
 */
router.post('/generate-otp', generateOtp);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags: ['Auth']
 *     summary: Verify OTP and get JWT
 *     description: This endpoint verifies the OTP entered by the user and returns a JWT token if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The phone number for which the OTP needs to be verified.
 *                 example: ''
 *               otp:
 *                 type: string
 *                 description: The OTP entered by the user.
 *                 example: ''
 *     responses:
 *       200:
 *         description: OTP verified and JWT returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'OTP verified successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: '60d21b4667d0d8992e610c85'
 *                     phone:
 *                       type: string
 *                       example: '+1234567890'
 *                     accessToken:
 *                       type: string
 *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                     refreshToken:
 *                       type: string
 *                       example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       400:
 *         description: Invalid OTP or phone number.
 *       401:
 *         description: OTP verification failed.
 *       500:
 *         description: Internal server error.
 */
router.post('/verify-otp', verifyOtp);

export default router;
