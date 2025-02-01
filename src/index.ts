import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cityRoutes from './routes/cityRoutes';
import stateRoutes from './routes/stateRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import http from "http";
import { Server as SocketIOServer } from 'socket.io';
import { swaggerSpec, swaggerUi } from './swagger';
import { CONFIG } from './config/config';
import './models/accessToken';
import './models/refreshToken';
import { initializeSocket } from './sockets';

dotenv.config();

const app = express();
const server = http.createServer(app);

initializeSocket(server); // ✅ Initialize socket.io with the HTTP server)


// MongoDB Connection
mongoose
  .connect(CONFIG.MONGO_URI ?? 'mongodb://127.0.0.1:27017/citiesDB', {
    serverApi: { version: '1' },
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/cities', cityRoutes);
app.use('/states', stateRoutes); 
app.use('/auth', authRoutes); // Add auth routes for authentication

// Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});


// Start the server
server.listen(CONFIG.PORT ?? 3000, () => {
  console.log(`🚀 Server running on http://localhost:${CONFIG.PORT ?? 3000}`);
  console.log('✅ Socket.io initialized.');
});

