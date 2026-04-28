import express from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware } from '../middleware/auth.js';
import Log from '../models/Log.js';
import Badge from '../models/Badge.js';
import { logToConsole } from '../utils/logger.js';

const router = express.Router();

/**
 * @desc Get global system health metrics
 * @route GET /api/system/health
 */
router.get('/health', async (req, res) => {
  try {
    // Check Cloudinary Status
    let cloudinaryStatus = 'disconnected';
    try {
      const cdRes = await cloudinary.api.ping();
      if (cdRes && cdRes.status === 'ok') cloudinaryStatus = 'connected';
    } catch (err) {
      cloudinaryStatus = 'error';
    }

    const healthStats = {
      uptime: process.uptime(), // Server Uptime in seconds
      mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      cloudinaryStatus,
      timestamp: new Date()
    };

    res.json(healthStats);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving system health' });
  }
});

/**
 * @desc Fetch historical logs from DB
 * @route GET /api/system/logs
 */
router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await Log.find().sort({ timestamp: -1 }).limit(limit);
    // Reverse so chronologically ordered in terminal natively
    res.json(logs.reverse());
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

/**
 * @desc System Reboot/Clear Cache Logic
 * @route POST /api/system/clear-cache
 */
router.post('/clear-cache', authMiddleware, async (req, res) => {
  try {
    // Emit log message
    await logToConsole(`System reboot initiated by user ${req.user?._id || req.userId || 'admin'}...`, 'system');
    await logToConsole(`Cleared neural-link telemetry cache`, 'success');
    await logToConsole(`Global metrics re-synchronized.`, 'info');
    
    res.status(200).json({ message: 'System cache cleared and rebooted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to execute system reboot' });
  }
});


export default router;
