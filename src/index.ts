import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import authhRoutes from './routes/authhRoutes';
import { CustomRequest } from './interfaces/customRequest';
//import passport from './config/passportConfig';
//import authRoutes from './routes/authRoutes';
//import { initializePassport } from './passport/bearer';
import { swaggerSpec, swaggerUi } from './swagger';
import userRoutes from './routes/user';
import stateRoutes from './routes/stateRoutes'
import './models/accessToken';
import './models/refreshToken';
import {CONFIG}  from  './config/config'
import './passport/bearer'
import passport from 'passport';
 import { bearerStrategy } from './passport/bearer'
//import authRoutes from './routes/authhRoutes'; 
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Import routes
import cityRoutes from './routes/cityRoutes';


// Use routes
app.use('/cities', cityRoutes);
app.use('/states',stateRoutes);
app.use('/auth', authhRoutes);
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use your routes
app.use('/api', userRoutes);
// Error handling middleware
// app.use((err: any, req: any, res: any, next: any) => {
//   console.error(err.stack);
//   res.status(500).send({ error: 'Something went wrong!' });
// });

// app.use((req: CustomRequest, res: Response, next: NextFunction) => {
//   if (req.customReq) {
//     const { isSuccessful, data, message } = req.customReq;
    
//     // Check if isSuccessful is true or false and return appropriate status code
//   //   if (isSuccessful) {
//   //     return res.status(200).json({ data, message });
//   //   } else {
//   //     return res.status(400).json({ data, message });
//   //   }
//   // }
//   if (typeof isSuccessful === 'boolean') {
//     return res.status(isSuccessful ? 200 : 400).json({ data, message });
//   }
// }
//   next(); // Proceed to the next middleware if customReq is not present
// });
// MongoDB connection
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));



app.use(passport.initialize());
passport.use(bearerStrategy);
// app.use(passport.session());
// initializePassport();
// app.get('/protected', passport.authenticate('bearer', { session: false }), (req, res) => {
//   res.status(200).json({
//     message: 'You have accessed a protected route!',
//     user: req.user // Will contain the authenticated user
//   });
// });
// const mongoURI = process.env.MONGO_URI;
// const port = process.env.PORT || 3000;

const mongoURI=CONFIG.MONGO_URI;
const port=CONFIG.PORT;
if (!mongoURI) {
  throw new Error('MongoDB URI is not defined in .env file.');
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

  