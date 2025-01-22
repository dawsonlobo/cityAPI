import { Request, Response } from 'express';  
import { User } from '../models/userModel';  
import { Otp } from '../models/otpModel'; 
import AccessToken from '../models/accessToken';
import RefreshToken from '../models/refreshToken'; 
import jwt from 'jsonwebtoken';  
import crypto from 'crypto';  
import mongoose from 'mongoose';
import { CONFIG } from '../config/config';


// Generate OTP
export const generateOtp = async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.body;
  
    // Validate input
    if (!phone) {
      res.status(400).json({ message: 'Phone number is required' });
      return;
    }
  
    try {
      // Check if the user exists
      const user = await User.findOne({ phone });
      if (!user) {
        res.status(400).json({ message: "User doesn't exist. Please signup." });
        return;
      }
  
      // Generate a 4-digit OTP
      const otp = crypto.randomInt(1000, 9999).toString();
  
      // Clear any existing OTPs for this phone number
      await Otp.deleteMany({ phone });
  
      // Save the new OTP in the database
      const otpDoc = new Otp({
        phone,
        otp,
        userId: new mongoose.Types.ObjectId(String(user._id)), // Use the user's ID here
      });

      await otpDoc.save();
  
      // In production, send OTP via SMS or email instead of including it in the response
      res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error: unknown) {
      // Type assertion: Assert that error is an instance of Error
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error generating OTP', error: error.message });
      } else {
        // Handle case where error is not an instance of Error
        res.status(500).json({ message: 'An unknown error occurred while generating OTP' });
      }
    }
  };

// Verify OTP  
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { phone, otp } = req.body;

  // Validate input
  if (!phone || !otp) {
    res.status(400).json({ message: 'Phone number and OTP are required' });
    return;
  }

  try {
    // Check if OTP is valid
    const validOtp = await Otp.findOne({ phone, otp });
    if (!validOtp) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // Clear OTPs after verification
    await Otp.deleteMany({ phone });

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error(`User with phone number ${phone} does not exist.`);
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id, phone: user.phone },
      CONFIG.JWT_SECRET!, // Ensure JWT_SECRET is set in your environment variables
      { expiresIn: '10d' } // Access token expires in 10 days
    );

    const refreshToken = jwt.sign(
      { id: user._id, phone: user.phone },
      CONFIG.JWT_SECRET!, // Same secret key
      { expiresIn: '365d' } // Refresh token expires in 365 days
    );

    const accessTokenDoc = new AccessToken({
        userId: user._id,
        token: accessToken,
      });
  
      await accessTokenDoc.save();

    const refreshTokenDoc = new RefreshToken({
        userId: user._id,
        token: refreshToken,
      });
  
      await refreshTokenDoc.save();
      

    // Respond with tokens and user details
    res.status(200).json({
      message: 'OTP verified successfully',
      data: { ...user.toObject(),
        accessToken,
        refreshToken,
       }
    });
} catch (error: unknown) {
    const err = error as Error; // Cast the error as Error
    res.status(500).json({ message: err.message || 'Error verifying OTP' });
  }
};