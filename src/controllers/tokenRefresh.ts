import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AccessToken from '../models/accessToken';
import RefreshToken from '../models/refreshToken';
import { CONFIG } from '../config/config';  // Your config file for the JWT secret and expiry

// Controller to refresh Access Token
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    // Validate the refresh token
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const existingRefreshToken = await RefreshToken.findOne({ token: refreshToken });
    if (!existingRefreshToken) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, CONFIG.JWT_SECRET);
    const userId = (decoded as any).userId;

    // Generate a new Access Token
    const newAccessToken = jwt.sign(
      { userId },
      CONFIG.JWT_SECRET,
      { expiresIn: CONFIG.ACCESS_TOKEN_EXPIRY }
    );

    // Optionally, you can invalidate the old refresh token or issue a new one if needed
    // For simplicity, this example does not invalidate or rotate the refresh token
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Something went wrong' });
  }
};
