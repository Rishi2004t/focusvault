import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import webpush from 'web-push';
import { initSocket } from './utils/socket.js';
import { initCronJobs } from './utils/cron.js';
import Subscription from './models/Subscription.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Environment
dotenv.config({ path: path.join(__dirname, '.env') });

// Import routes
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import tasksRoutes from './routes/tasks.js';
import uploadRoutes from './routes/upload.js';
import projectRoutes from './routes/projects.js';
import analyticsRoutes from './routes/analytics.js';
import teamsRoutes from './routes/teams.js';
import systemRoutes from './routes/system.js';
import codeRoutes from './routes/code.js';
import searchRoutes from './routes/search.js';
import aiRoutes from './routes/ai.js';
import soulRoutes from './routes/soul.js';
// Initialize Web Push with Neural Keys
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn('⚠️ Web Push keys missing in shell environment. Neural sync may be limited.');
} else {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:support@focusvault.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('📡 Neural Web Push initialized with custom vector.');
}

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development telemetry
  message: { message: 'Neural bandwidth limit exceeded. Please standby for synchronization.' },
});

app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'downloads/uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(passport.initialize());

// CORS setup with multiple origin support
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',') 
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Neural Telemetry: Log incoming origin
    if (origin) console.log(`📡 Neural Link Attempt from Origin: ${origin}`);
    
    // Liberal Dev Policy: Allow all local and private network variants
    if (!origin || 
        allowedOrigins.indexOf(origin) !== -1 || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') || 
        origin.match(/^http:\/\/(10|172|192)\./) // Matches 10.x.x.x, 172.x.x.x, 192.x.x.x
    ) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin (${origin}).`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Start Cron Jobs after successful DB connection
    initCronJobs();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ message: '✅ Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/soul', soulRoutes);
// Web Push Subscription Route
app.post('/api/notifications/subscribe', authMiddleware, async (req, res) => {
  try {
    const subscription = req.body;
    
    // Save or update subscription
    const sub = await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { 
        userId: req.userId,
        ...subscription
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Neural Sync established for user: ${req.userId} (Terminal: ${sub._id})`);
    res.status(201).json({ message: 'Neural Sync Established' });
  } catch (error) {
    console.error('❌ Subscription Error:', error);
    res.status(500).json({ message: 'Failed to establish Neural Sync' });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  // Neural Telemetry: Log Error details for diagnostics
  console.error(`❌ [Neural Error] ${req.method} ${req.url}`);
  console.error(err.stack || err);

  // Handle Multer upload errors specifically
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: 'Archival sequence interrupted: Protocol violation or capacity exceeded.',
      details: err.message,
      code: err.code
    });
  }

  // Handle Validation Errors (from express-validator or custom)
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({
      message: 'Validation Failure: Malformed neural parameters detected.',
      errors: err.errors
    });
  }

  // Handle MongoDB errors
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid target identifier detected in vault.' });
  }

  const status = err.status || 500;
  const message = err.message || 'Critical system failure in neural core.';

  res.status(status).json({
    message: message,
    success: false,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      neural_diagnostics: 'Dev trace active'
    }),
  });
});

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Neural Link active on port ${PORT}`);
});
