import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/userModel';

export default class AuthController {
  static register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password: hashedPassword,
        name
      });

      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  };

  static login: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('local', (err: Error, user: any, info: any) => {
      if (err) {
        next(err);
        return;
      }
      
      if (!user) {
        res.status(401).json({ message: info.message || 'Authentication failed' });
        return;
      }

      req.logIn(user, (err) => {
        if (err) {
          next(err);
          return;
        }
        res.json({ 
          message: 'Logged in successfully', 
          user: { id: user._id, email: user.email, name: user.name } 
        });
      });
    })(req, res, next);
  };

  static logout: RequestHandler = (req: Request, res: Response): void => {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ message: 'Error logging out' });
        return;
      }
      res.json({ message: 'Logged out successfully' });
    });
  };

  static getProfile: RequestHandler = (req: Request, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    res.json({ user: req.user });
  };
}