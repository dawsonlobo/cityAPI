import { Strategy as BearerStrategy } from 'passport-http-bearer';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

if (!mongoURI) {
  throw new Error('MongoDB URI is not defined in .env file.');
}


// // Get the MongoDB URI from environment variables (with fallback)
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb';

// // MongoDB connection using Mongoose
// mongoose
//   .connect(mongoURI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     // You can start your server here if needed
//     // app.listen(port, () => {
//     //   console.log(`Server is running on http://localhost:${port}`);
//     // });
//   })
//   .catch((err) => {
//     console.error('Database connection error:', err);
//   });


// Passport Bearer Strategy configuration
export const bearerStrategy = new BearerStrategy(async (token: string, done: (error: any, user?: any, info?: string) => void) => {
  try {
    // Verify the token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return done(null, false, 'Invalid token');
      }

      // Find the user in the database with the matching token
      const user = await User.findOne({ token }); // Ensure the token field exists in your schema
      if (!user) {
        return done(null, false, 'User not found');
      }

      return done(null, user); // Pass the user to the next middleware
    });
  } catch (error) {
    return done(error, false, 'Error occurred while processing the token');
  }
});

// Function to initialize the Bearer strategy
export const initializePassport = () => {
  passport.use(bearerStrategy);
};
