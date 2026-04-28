import express from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';
import Activity from '../models/Activity.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';

const router = express.Router();

router.get('/today', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch activities for today
    const activities = await Activity.find({
      userId,
      timestamp: { $gte: today }
    }).sort({ timestamp: 1 });

    // Fetch tasks completed today
    const tasksCompletedToday = await Task.countDocuments({
      userId,
      completed: true,
      completedAt: { $gte: today }
    });

    // Fetch user streak
    const user = await User.findById(userId);
    const streak = user?.streak || 0;

    // Collab actions (e.g., TEAM_JOIN, NOTE_SYNC)
    const collabActions = activities.filter(a => ['TEAM_JOIN', 'NOTE_SYNC'].includes(a.type)).length;

    // Estimate focus time
    const ideExecs = activities.filter(a => a.type === 'IDE_EXEC').length;
    const totalMinutes = (tasksCompletedToday * 30) + (ideExecs * 15);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const focusTime = `${hours}h ${minutes}m`;

    // Timeline mapping
    const timelineMap = new Map();
    activities.forEach(a => {
      const time = new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let eventName = a.message;
      if (a.type === 'TASK_OK') eventName = 'Task Completed';
      if (a.type === 'TASK_ADD') eventName = 'Task Added';
      if (a.type === 'IDE_EXEC') eventName = 'Code Execution';
      if (a.type === 'VAULT_ADD') eventName = 'Asset Vaulted';
      if (a.type === 'NOTE_CREATE') eventName = 'Note Created';
      
      timelineMap.set(time, eventName);
    });
    
    let timeline = Array.from(timelineMap.entries()).map(([time, event]) => ({ time, event }));
    // Limit to the most recent 5 events
    if (timeline.length > 5) {
      timeline = timeline.slice(-5);
    }

    if (timeline.length === 0) {
      timeline.push({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'System initialized' });
    }

    // Insight calculation
    let insight = "Consistent steady progress today.";
    if (tasksCompletedToday >= 5) {
      insight = "Exceptional task execution efficiency.";
    } else if (ideExecs > 2) {
      insight = "Deep engineering focus detected.";
    } else if (collabActions > 0) {
      insight = "Strong collaborative output.";
    } else if (tasksCompletedToday === 0 && activities.length === 0) {
      insight = "Neural matrix awaiting input.";
    }

    // Score
    const scoreVal = Math.min(100, Math.max(10, (tasksCompletedToday * 15) + (collabActions * 10) + (ideExecs * 5) + 30));
    const score = `${scoreVal}/100`;

    res.json({
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      focusTime,
      tasks: tasksCompletedToday,
      streak: `+${streak}`,
      collab: collabActions,
      timeline,
      insight,
      score
    });
  } catch (error) {
    console.error('❌ Error fetching today activity:', error);
    res.status(500).json({ message: 'Error retrieving daily report' });
  }
});

/**
 * GET /api/activity/all-badges
 * Get all available badges
 */
router.get('/all-badges', async (req, res) => {
  try {
    const badges = await Badge.find().sort({ minPoints: 1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching badges' });
  }
});

export default router;
