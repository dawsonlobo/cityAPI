import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Assuming you have a User model
import AccessToken from '../models/accessToken';
import RefreshToken from '../models/refreshToken';
import { CONFIG } from '../config/config';  // Your config file for the JWT secret and expiry

// Controller for Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Access Token and Refresh Token
    const accessToken = jwt.sign(
      { userId: user._id }, 
      CONFIG.JWT_SECRET, 
      { expiresIn: CONFIG.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user._id }, 
      CONFIG.JWT_SECRET, 
      { expiresIn: CONFIG.REFRESH_TOKEN_EXPIRY }
    );

    // Save tokens in the database
    const accessTokenRecord = new AccessToken({
      userId: user._id,
      token: accessToken,
      createdAt: new Date(),
    });
    await accessTokenRecord.save();

    const refreshTokenRecord = new RefreshToken({
      userId: user._id,
      token: refreshToken,
      createdAt: new Date(),
    });
    await refreshTokenRecord.save();

    // Send response with tokens
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
