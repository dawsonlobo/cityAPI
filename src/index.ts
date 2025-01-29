import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CustomRequest } from './interfaces/customRequest';
import { swaggerSpec, swaggerUi } from './swagger';
import stateRoutes from './routes/stateRoutes';
import userRoutes from './routes/userRoutes';
import cityRoutes from './routes/cityRoutes';
import authRoutes from './routes/authRoutes';
import notificationRoutes from './routes/notificationRoutes';
import './models/accessToken';
import './models/refreshToken';
import { CONFIG } from './config/config';
import './passport/bearer';
import passport from 'passport';
import { bearerStrategy } from './passport/bearer';
import { Response, NextFunction } from 'express';
const http = require('http');
import { initSocket } from './sockets'; 
//import socketSetup from "./sockets/index";
// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Socket server is running");
});
// Middleware
app.use(express.json());
app.use(passport.initialize());
passport.use(bearerStrategy);

// Routes
app.use('/cities', cityRoutes);
app.use('/states', stateRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Error handling middleware
// app.use((err: any, req: any, res: any, next: any) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Custom response handler middleware
// app.use((req: CustomRequest, res: Response, next: NextFunction) => {
//   if (req.customReq) {
//     const { statusCode, data, message } = req.customReq;
//     return res.status(statusCode).json({ data, message });
//   }
//   next();
// });

// Database connection
const mongoURI = CONFIG.MONGO_URI;
const port = CONFIG.PORT;

if (!mongoURI) {
  throw new Error('MongoDB URI is not defined in configuration.');
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
    process.exit(1);
  });
  initSocket(server);
export default app;