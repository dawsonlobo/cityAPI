import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

let io: Server;
const connectedUsers: { [userId: string]: Socket } = {};

export const initSocket = (server: any) => {
  console.log('Starting socket initialization...');
  
  io = new Server(server, {
    cors: {
      origin: '*',  // Changed to allow all origins for testing
      //methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Authorization']
    },
    path: '/socket.io'  // Explicitly set the path
  });

  console.log('Socket.IO server created');

  // Authentication middleware
  io.use((socket, next) => {
    console.log('Request URL:', socket.handshake.url);
  console.log('Request Headers:', socket.handshake.headers);
    console.log('New socket connection attempt...');
    console.log('Headers received:', socket.handshake.headers);
    
    const token1 = String(socket.handshake.headers.authorization);
    console.log('Token received:', token1); 
    if (!token1) {
      console.error('No authorization token provided');
      return next(new Error('Authentication error: No token provided'));
    }
    console.log(`User ${socket.data.userId} connected. Current connected users: ${Object.keys(connectedUsers)}`);

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error('JWT_SECRET not found in environment variables');
      return next(new Error('Missing JWT secret key'));
    }

    try {
      const token = token1.replace('Bearer ', '');
      console.log('Attempting to verify token...');
      
      const decoded = jwt.verify(token, secretKey) as { id: string };
      socket.data.userId = decoded.id;
      connectedUsers[decoded.id] = socket;
      
      console.log('=== Connection Success ===');
      console.log(`User authenticated: ${decoded.id}`);
      console.log('Current connected users:', Object.keys(connectedUsers));
      
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    console.log('=== New Client Connected ===');
    console.log(`User ID: ${socket.data.userId}`);
    console.log('Total connected users:', Object.keys(connectedUsers).length);
    
    // Listen for specific events
    socket.on('state-added', (data) => {
      console.log('Received state-added event:', data);
    });

    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      if (connectedUsers[userId]) {
        delete connectedUsers[userId];
        console.log('=== User Disconnected ===');
        console.log(`User ID: ${userId}`);
        console.log('Remaining connected users:', Object.keys(connectedUsers));
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('Socket initialization complete');
  return io;
};

// Notification function with enhanced logging
export const notifyUser = (userId: string, event: string, payload: any) => {
  console.log('\n=== Attempting to Send Notification ===');
  console.log('Target User ID:', userId);
  console.log('Event:', event);
  console.log('Payload:', payload);
  console.log('Currently connected users:', Object.keys(connectedUsers));
  
  if (connectedUsers[userId]) {
    try {
      connectedUsers[userId].emit(event, payload);
      console.log(`✅ Success: Notification sent to user ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Error emitting event:', error);
      return false;
    }
  } else {
    console.error(`❌ Error: No connected socket for user: ${userId}`);
    console.log('Available user IDs:', Object.keys(connectedUsers));
    return false;
  }
};