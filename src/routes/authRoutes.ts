import express from 'express';
import { login, sendOtp, refreshToken, signup } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: ['Auth']
 *     summary: Register a new user
 *     description: Registers a new user with phone number, password, and name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 description: "User's description"
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid phone number, password, or missing required fields
 *       500:
 *         description: Server error
 */
router.post('/signup', signup);

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     tags: ['Auth']
 *     summary: Send OTP for email-based authentication
 *     description: Sends a one-time password (OTP) to the user's email for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid or missing email address
 *       500:
 *         description: Server error
 */
router.post('/send-otp', sendOtp);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: ['Auth']
 *     summary: Login with OTP
 *     description: Verify OTP and generate JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "1234567890"
 *               otp:
 *                 type: string
 *                 description: One-time password
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *       400:
 *         description: Invalid OTP
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: ['Auth']
 *     summary: Refresh access token
 *     description: Generate a new access token using a valid refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token from previous login
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkVCJ9..."
 *     responses:
 *       200:
 *         description: Successfully refreshed access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: New refresh token
 *       400:
 *         description: Invalid refresh token
 *       500:
 *         description: Server error
 */
router.post('/refresh-token', refreshToken);

export default router;
