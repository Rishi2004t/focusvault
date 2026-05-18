import express from 'express';
import User from '../models/User.js';
import SoulEntry from '../models/SoulEntry.js';
import { authMiddleware } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// ── Status ──
// Checks if Soul Vault is set up (password-based takes priority over legacy moodLock)
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('moodLock soulVault');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // New password-based system takes priority
    if (user.soulVault?.password) {
      return res.json({ isSetup: true, isLocked: true, authType: 'password' });
    }

    // Legacy moodLock fallback
    res.json({
      isSetup: user.moodLock?.isSetup || false,
      isLocked: user.moodLock?.isSetup || false,
      lockoutUntil: user.moodLock?.lockoutUntil,
      authType: 'moodlock',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking status', error: error.message });
  }
});

// ── Setup Password (New System) ──
router.post('/setup-password', authMiddleware, async (req, res) => {
  try {
    const { password, securityQuestion, securityAnswer } = req.body;
    if (!password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: 'Password, Security Question, and Answer are required' });
    }

    const user = await User.findById(req.userId);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

    if (!user.soulVault) user.soulVault = {};
    user.soulVault.password = hashedPassword;
    user.soulVault.securityQuestion = securityQuestion;
    user.soulVault.securityAnswer = hashedAnswer;

    // Keep moodLock in sync so legacy status checks work
    if (!user.moodLock) user.moodLock = {};
    user.moodLock.isSetup = true;

    await user.save();
    res.json({ success: true, message: 'Soul Vault password set up successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Setup failed', error: error.message });
  }
});

// ── Unlock Vault (Password-Based) ──
router.post('/unlock', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const user = await User.findById(req.userId).select('soulVault');

    if (!user?.soulVault?.password) {
      return res.status(400).json({ message: 'Soul Vault not set up with a password' });
    }

    const isMatch = await bcrypt.compare(password, user.soulVault.password);
    if (isMatch) {
      res.json({ success: true, message: 'Vault unlocked' });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unlock error', error: error.message });
  }
});

// ── Get Security Question ──
// Checks soulVault first, falls back to moodLock for legacy users
router.get('/question', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('soulVault moodLock');
    const question = user?.soulVault?.securityQuestion || user?.moodLock?.securityQuestion;
    if (!question) {
      return res.status(404).json({ message: 'No security question configured' });
    }
    res.json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
});

// ── Verify Security Answer ──
router.post('/verify-answer', authMiddleware, async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ message: 'Answer is required' });

    const user = await User.findById(req.userId).select('soulVault moodLock');
    const hashedAnswer = user?.soulVault?.securityAnswer || user?.moodLock?.securityAnswer;

    if (!hashedAnswer) {
      return res.status(404).json({ message: 'No security answer configured' });
    }

    const isMatch = await bcrypt.compare(answer.toLowerCase().trim(), hashedAnswer);
    if (isMatch) {
      res.json({ success: true, message: 'Answer verified' });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect answer' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification error', error: error.message });
  }
});

// ── Reset Password ──
router.post('/reset-password', authMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: 'New password is required' });

    const user = await User.findById(req.userId);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (!user.soulVault) user.soulVault = {};
    user.soulVault.password = hashedPassword;

    // Reset any lockout state
    if (user.moodLock) {
      user.moodLock.failedAttempts = 0;
      user.moodLock.lockoutUntil = null;
    }

    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset error', error: error.message });
  }
});

// ── Legacy MoodLock Setup (color + emoji) ──
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

// ── Legacy MoodLock Verify ──
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { color, emoji } = req.body;
    const user = await User.findById(req.userId).select('moodLock');

    if (user.moodLock.lockoutUntil && user.moodLock.lockoutUntil > new Date()) {
      const remaining = Math.ceil((user.moodLock.lockoutUntil - new Date()) / 60000);
      return res.status(403).json({
        message: `System locked. Try again in ${remaining} minutes.`,
        lockoutUntil: user.moodLock.lockoutUntil,
      });
    }

    if (user.moodLock.color === color && user.moodLock.emoji === emoji) {
      user.moodLock.failedAttempts = 0;
      user.moodLock.lockoutUntil = null;
      await user.save();
      res.json({ success: true, message: 'Vault unlocked' });
    } else {
      user.moodLock.failedAttempts += 1;
      let lockoutMessage = 'Incorrect combination';
      if (user.moodLock.failedAttempts >= 3) {
        user.moodLock.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
        lockoutMessage = 'System locked for 15 minutes due to 3 failed attempts.';
      }
      await user.save();
      res.status(401).json({ success: false, message: lockoutMessage, attemptsLeft: Math.max(0, 3 - user.moodLock.failedAttempts) });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification error', error: error.message });
  }
});

// ── Legacy MoodLock Reset ──
router.post('/reset', authMiddleware, async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ message: 'Answer is required' });

    const user = await User.findById(req.userId).select('moodLock');
    if (!user?.moodLock?.securityAnswer) {
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

// ── Diary Entries ──
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
    const newEntry = new SoulEntry({ userId: req.userId, content, emotion });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error saving entry', error: error.message });
  }
});

export default router;
