import { Strategy as BearerStrategy } from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import dotenv from 'dotenv';
import Types from 'mongoose'
import mongoose from 'mongoose';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

interface CustomJwtPayload extends jwt.JwtPayload {
  userId: string;
  token?: string; // Optional, if you choose to include it in the JWT payload
}

export const bearerStrategy = new BearerStrategy(async (token: string, done: (error: any, user?: any, info?: string) => void) => {
  if (!token) {
    console.error("Token not provided");
    return done(null, false, 'No token provided');
  }

  try {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return done(null, false, 'Invalid token');
      }

      // Log decoded JWT to check its structure
      console.log("Decoded JWT:", decoded);

      const decodedToken = decoded as CustomJwtPayload;

      // Ensure the decoded token contains the expected fields
      if (!decodedToken || !decodedToken.id) {
        console.error("Decoded token is invalid or missing required fields");
        return done(null, false, 'Invalid token');
      }

      // Find the user by the id field
      const user = await User.findOne({ _id: new mongoose.Types.ObjectId(String(decodedToken.id)) });
      if (!user) {
        console.error("User not found");
        return done(null, false, 'User not found');
      }
         // Extract the user's name from the user object
         const userName = user.name;

         // Add the user's name to the user object (or pass it directly)
         const userWithName = {
           ...user.toObject(),
           name: userName, // Include the name in the response
         };

      return done(null, userWithName); // Pass the user to the next middleware
    });
  } catch (error) {
    console.error("Error in BearerStrategy:", error);
    return done(error, false, 'Error occurred while processing the token');
  }
});
