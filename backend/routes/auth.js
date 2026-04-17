import express from 'express';
import { body } from 'express-validator';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { authMiddleware, generateToken } from '../middleware/auth.js';
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import passport from '../config/passport.js';

const router = express.Router();

// Local Auth
router.post(
  '/signup',
  [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Password Recovery
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resettoken', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // We send back a script to the frontend to handle the token/user data
    const token = generateToken(req.user._id);
    const userStr = JSON.stringify({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      darkMode: req.user.darkMode,
    });
    
    // Redirect to frontend with token and user in query params
    const isProd = process.env.NODE_ENV === 'production';
    const frontendBase = isProd ? 'https://focusvault-khaki.vercel.app' : 'http://localhost:3000';
    const redirectUrl = `${frontendBase}/dashboard?token=${token}&user=${encodeURIComponent(userStr)}`;
    res.redirect(redirectUrl);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const userStr = JSON.stringify({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      darkMode: req.user.darkMode,
    });
    
    // Redirect to frontend with token and user in query params
    const isProd = process.env.NODE_ENV === 'production';
    const frontendBase = isProd ? 'https://focusvault-khaki.vercel.app' : 'http://localhost:3000';
    const redirectUrl = `${frontendBase}/dashboard?token=${token}&user=${encodeURIComponent(userStr)}`;
    res.redirect(redirectUrl);
  }
);

// Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Streak Logic
    const now = new Date();
    const lastLogin = new Date(user.lastLogin || now);
    const diffInDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));

    if (diffInDays === 1) {
      // Logged in yesterday
      user.streak += 1;
      user.lastLogin = now;
      await user.save();
    } else if (diffInDays > 1) {
      // Missed a day or more
      user.streak = 1;
      user.lastLogin = now;
      await user.save();
    } else if (user.streak === 0) {
      // First time or starting fresh
      user.streak = 1;
      user.lastLogin = now;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, darkMode, theme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(username && { username }),
        ...(darkMode !== undefined && { darkMode }),
        ...(theme && { 'preferences.theme': theme }),
      },
      { new: true }
    );
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout (frontend will just remove the token)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

/**
 * Neural Subscription Protocol: Registers Web Push endpoints for background alerts
 */
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { endpoint, expirationTime, keys } = req.body;
    
    if (!endpoint || !keys) {
      return res.status(400).json({ message: 'Invalid neural endpoint configuration' });
    }

    // Upsert the subscription (one entry per endpoint per user)
    const subscription = await Subscription.findOneAndUpdate(
      { endpoint },
      { userId: req.userId, endpoint, expirationTime, keys },
      { upsert: true, new: true }
    );

    console.log(`📡 Neural Link Registered for User: ${req.userId} (Endpoint: ${endpoint.substring(0, 30)}...)`);
    res.status(201).json({ message: 'Neural Alerts Synchronized' });
  } catch (error) {
    console.error('❌ Subscription Failed:', error);
    res.status(500).json({ message: 'Neural Link Failure' });
  }
});

export default router;
