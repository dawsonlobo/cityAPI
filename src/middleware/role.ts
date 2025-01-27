import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/config';
import User from '../models/userModel';

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token is required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET!) as { id: string; role: string };

    if (!decoded) {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }

    // Check the user's role
    if (decoded.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admins only.' });
      return;
    }

    // Optionally, fetch the user to ensure they exist and are active
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Add user details to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    if (err.name === 'JsonWebTokenError') {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
