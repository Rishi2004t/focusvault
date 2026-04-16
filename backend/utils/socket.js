import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  // Combine env-configured origins with hardcoded production URLs
  const envOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const allowedOrigins = [
    ...envOrigins,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://focusvault-khaki.vercel.app',
  ];

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.match(/^http:\/\/(10|172|192)\./)
        ) {
          callback(null, true);
        } else {
          console.warn(`🚫 Socket CORS blocked: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('🔗 Neural Link Established:', socket.id);

    // Personal user room (for task notifications)
    socket.on('join_user', (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} synchronized with terminal`);
    });

    // Team collaboration room
    socket.on('join_team', (teamId) => {
      socket.join(`team_${teamId}`);
      console.log(`🏗️ Socket ${socket.id} joined team room: team_${teamId}`);
    });

    socket.on('leave_team', (teamId) => {
      socket.leave(`team_${teamId}`);
    });

    // Real-time typing indicator
    socket.on('typing', ({ teamId, userName }) => {
      socket.to(`team_${teamId}`).emit('user_typing', { userName });
    });

    socket.on('disconnect', () => {
      console.log('❌ Neural Link Severed');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
