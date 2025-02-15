import { Request, Response } from 'express';
//import { User } from '../models/userModel'
import { Otp } from '../models/otpModel';
import AccessToken from '../models/accessToken';
import RefreshToken from '../models/refreshToken';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { CONFIG } from '../config/config';
import User from '../models/userModel';
import { sendEmail } from '../services/emailService';
import { getTwilioFunctions } from '../services/sms'
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  //const { phone } = req.body;
  const { email ,phone} = req.body;
  if (!email || !phone ) {
    res.status(400).json({ message: 'email and phone number are  required' });
    return;
  }

  try {
    const user = await User.findOne({ email,phone});
    if (!user) {
      res.status(400).json({ message: "User doesn't exist. Please signup." });
      return;
    }

    const otp = crypto.randomInt(1000, 9999).toString();

    await Otp.deleteMany({ email,phone});

    const otpDoc = new Otp({
      email,
      otp,
      userId: new mongoose.Types.ObjectId(String(user._id)),
    });
    await otpDoc.save();
    await sendEmail(email, 'Your OTP for Login', otp);
    const twilioService = await getTwilioFunctions();
    if (!twilioService) {
      res.status(500).json({ message: 'SMS service provider not available' });
      return;
    }

    // Send OTP via SMS
    const smsResponse = await twilioService.sendSMS(phone, `Your OTP for login is: ${otp}`) as { success: boolean, error?: string };
    const whatsappResponse = await twilioService.sendWhatsApp(phone, `Your OTP for login is: ${otp}`) as { success: boolean, error?: string };
    if (smsResponse.success && whatsappResponse) {
      res.status(200).json({ message: 'OTP sent successfully via Email,SMS and whatsapp' });
    } else {
      res.status(500).json({ message: 'Error sending OTP via SMS', error: smsResponse.error });
    }
    
    res.status(200).json({ message: 'OTP sent successfully'});
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    res.status(500).json({ 
      message: 'Error sending OTP', 
      error: err.message 
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    res.status(400).json({ message: 'Phone number and OTP are required' });
    return;
  }

  try {
    const validOtp = await Otp.findOne({ phone, otp });
    if (!validOtp) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    await Otp.deleteMany({ phone });

    const user = await User.findOne({ phone });
    if (!user) {
      res.status(400).json({ message: "User doesn't exist" });
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      CONFIG.JWT_SECRET!,
      { expiresIn: '10d' }
    );

    const refreshToken = jwt.sign(
      { id: user._id, phone: user.phone },
      CONFIG.JWT_SECRET!,
      { expiresIn: '365d' }
    );

    console.log('Generated Access Token:', accessToken);
    //console.log('role':user.role)
    console.log('Generated Refresh Token:', refreshToken);

    const accessTokenDoc = new AccessToken({
      userId: user._id,
      token: accessToken,
    });

    const refreshTokenDoc = new RefreshToken({
      userId: user._id,
      token: refreshToken,
    });

    try {
      await Promise.all([
        accessTokenDoc.save(),
        refreshTokenDoc.save()
      ]);
      console.log('Tokens saved successfully');
    } catch (saveError) {
      console.error('Error saving tokens:', saveError);
    }

    res.status(200).json({
      message: 'Login successful',
      data: {
        ...user.toObject(),
        accessToken,
        refreshToken
      }
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    res.status(400).json({ 
      message: 'Error during login', 
      error: err.message 
    });
  }
};


export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token is required' });
    return;
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, CONFIG.JWT_SECRET!) as { 
      id: string, 
      phone: string 
    };

    // Check if the refresh token exists in the database
    const existingRefreshToken = await RefreshToken.findOne({ 
      userId: decoded.id, 
      token: refreshToken 
    });

    if (!existingRefreshToken) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(403).json({ message: 'User not found' });
      return;
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { id: user._id, phone: user.phone },
      CONFIG.JWT_SECRET!,
      { expiresIn: CONFIG.ACCESS_TOKEN_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, phone: user.phone },
      CONFIG.JWT_SECRET!,
      { expiresIn:  CONFIG.REFRESH_TOKEN_EXPIRY }
    );

    // Save new tokens
    await AccessToken.deleteMany({ userId: user._id });
    await RefreshToken.deleteMany({ userId: user._id });

    const newAccessTokenDoc = new AccessToken({
      userId: user._id,
      token: newAccessToken,
    });

    const newRefreshTokenDoc = new RefreshToken({
      userId: user._id,
      token: newRefreshToken,
    });

    await Promise.all([
      newAccessTokenDoc.save(),
      newRefreshTokenDoc.save()
    ]);

    res.status(200).json({
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    
    if (err.name === 'JsonWebTokenError') {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    res.status(400).json({ 
      message: 'Error refreshing token', 
      error: err.message 
    });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, phone, email,password, token } = req.body;

  // Validate if name, phone, and password are provided
  if (!name || !phone || !password) {
    res.status(400).json({ message: 'Name, phone number, and password are required' });
    return;
  }

  try {
    // Check if user already exists based on phone number
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }

    // Create a new user with name, phone, password, and token
    const newUser = new User({ name, phone, password, token ,email});
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    res.status(400).json({ 
      message: 'Error creating user', 
      error: err.message 
    });
  }
};
