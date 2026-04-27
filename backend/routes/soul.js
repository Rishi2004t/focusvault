import express from 'express';
import User from '../models/User.js';
import SoulEntry from '../models/SoulEntry.js';
import { authMiddleware } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// ── MoodLock Status ──
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('moodLock');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({
      isSetup: user.moodLock.isSetup,
      isLocked: user.moodLock.isSetup, // Assume locked if setup
      lockoutUntil: user.moodLock.lockoutUntil,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking status', error: error.message });
  }
});

// ── Setup MoodLock ──
router.post('/setup', authMiddleware, async (req, res) => {
  try {
    const { color, emoji, securityQuestion, securityAnswer } = req.body;
    if (!color || !emoji || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: 'Color, Emoji, Security Question, and Answer are required' });
    }

    const user = await User.findById(req.userId);
    
    const salt = await bcrypt.genSalt(10);
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

    user.moodLock.color = color;
    user.moodLock.emoji = emoji;
    user.moodLock.securityQuestion = securityQuestion;
    user.moodLock.securityAnswer = hashedAnswer;
    user.moodLock.isSetup = true;
    user.moodLock.failedAttempts = 0;
    user.moodLock.lockoutUntil = null;
    
    await user.save();
    res.json({ success: true, message: 'MoodLock established' });
  } catch (error) {
    res.status(500).json({ message: 'Setup failed', error: error.message });
  }
});

// ── Verify MoodLock ──
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { color, emoji } = req.body;
    const user = await User.findById(req.userId).select('moodLock');

    // Check lockout
    if (user.moodLock.lockoutUntil && user.moodLock.lockoutUntil > new Date()) {
      const remaining = Math.ceil((user.moodLock.lockoutUntil - new Date()) / 60000);
      return res.status(403).json({ 
        message: `System locked due to failed attempts. Try again in ${remaining} minutes.`,
        lockoutUntil: user.moodLock.lockoutUntil
      });
    }

    if (user.moodLock.color === color && user.moodLock.emoji === emoji) {
      // Success
      user.moodLock.failedAttempts = 0;
      user.moodLock.lockoutUntil = null;
      await user.save();
      
      // In a real prod app, you might set a cookie or return a short-lived token.
      // For this implementation, we'll respond with success and let frontend manage session view.
      res.json({ success: true, message: 'Vault unlocked' });
    } else {
      // Failure
      user.moodLock.failedAttempts += 1;
      let lockoutMessage = 'Incorrect combination';
      
      if (user.moodLock.failedAttempts >= 3) {
        user.moodLock.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
        lockoutMessage = 'System locked for 15 minutes due to 3 failed attempts.';
      }
      
      await user.save();
      res.status(401).json({ 
        success: false, 
        message: lockoutMessage,
        attemptsLeft: Math.max(0, 3 - user.moodLock.failedAttempts)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification error', error: error.message });
  }
});

// ── Get Security Question ──
router.get('/question', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('moodLock.securityQuestion');
    if (!user || !user.moodLock.securityQuestion) {
      return res.status(404).json({ message: 'Security question not found' });
    }
    res.json({ question: user.moodLock.securityQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
});

// ── Reset MoodLock ──
router.post('/reset', authMiddleware, async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    const user = await User.findById(req.userId).select('moodLock');
    if (!user || !user.moodLock.securityAnswer) {
      return res.status(400).json({ message: 'No security answer configured' });
    }

    const isMatch = await bcrypt.compare(answer.toLowerCase().trim(), user.moodLock.securityAnswer);
    if (isMatch) {
      user.moodLock.isSetup = false;
      user.moodLock.failedAttempts = 0;
      user.moodLock.lockoutUntil = null;
      user.moodLock.color = null;
      user.moodLock.emoji = null;
      await user.save();
      res.json({ success: true, message: 'MoodLock reset successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect answer' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Reset error', error: error.message });
  }
});

// ── Diary Entries (Protected) ──
router.get('/entries', authMiddleware, async (req, res) => {
  try {
    const entries = await SoulEntry.find({ userId: req.userId }).sort({ timestamp: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries', error: error.message });
  }
});

router.post('/entries', authMiddleware, async (req, res) => {
  try {
    const { content, emotion } = req.body;
    if (!content || !emotion) {
      return res.status(400).json({ message: 'Content and Emotion are required' });
    }

    const newEntry = new SoulEntry({
      userId: req.userId,
      content,
      emotion,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error saving entry', error: error.message });
  }
});

export default router;
