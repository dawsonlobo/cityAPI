import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

let io: Server;
const connectedUsers: { [userId: string]: Socket } = {};

// Initialize the socket server
export const initSocket = (server: any) => {
  io = new Server(server, { cors: { origin: '*' } });

  io.use((socket, next) => {
    // Extract the token from the authorization header in the handshake
    const token1 = String(socket.handshake.headers.authorization);  // Get token from the header

    if (!token1) {
      return next(new Error('Authentication error: No token provided'));
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return next(new Error('Missing JWT secret key'));
    }

    try {
      // Remove the "Bearer " part from the token if it's included
      const token = token1.replace('Bearer ', '');

      // Verify the token
      const decoded = jwt.verify(token, secretKey) as { id: string };
      socket.data.userId = decoded.id;  // Attach the userId to the socket
      connectedUsers[decoded.id] = socket; // Track connected user
      console.log(`User authenticated: ${decoded.id}`);
      next();
    } catch (err) {
      console.error('Token verification failed', err);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.data.userId}`);

    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      if (connectedUsers[userId]) {
        delete connectedUsers[userId];
        console.log(`User disconnected: ${userId}`);
      }
    });
  });

  return io;
};

// Emit notification to a specific user
export const notifyUser = (userId: string, event: string, payload: any) => {
  if (connectedUsers[userId]) {
    connectedUsers[userId].emit(event, payload);
  } else {
    console.error(`No connected socket for user: ${userId}`);
  }
};
