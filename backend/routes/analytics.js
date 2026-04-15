import express from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Asset from '../models/Asset.js';
import Task from '../models/Task.js';
import Note from '../models/Note.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { authMiddleware } from '../middleware/auth.js';
import { recordActivity } from '../utils/logger.js';

const router = express.Router();

/**
 * Utility: Calculate percentage change
 */
const getTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * GET /api/analytics/dashboard-stats
 * Aggregates high-fidelity metrics with trends and sparklines
 */
router.get('/dashboard-stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // 1. Core Counts
    const [totalNotes, totalTasks, completedTasks, activeProjects, storageData] = await Promise.all([
      Note.countDocuments({ userId }),
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, completed: true }),
      Project.countDocuments({ userId, status: { $ne: 'Completed' } }),
      Asset.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalSize: { $sum: "$size" } } }
      ])
    ]);

    const storageBytes = storageData[0]?.totalSize || 0;
    const storageGBStr = (storageBytes / (1024 * 1024 * 1024)).toFixed(2);

    // 2. Trend Metrics (Compares last 7 days vs previous 7 days)
    const [currentNotes, prevNotes, currentTasks, prevTasks] = await Promise.all([
      Note.countDocuments({ userId, createdAt: { $gte: sevenDaysAgo } }),
      Note.countDocuments({ userId, createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } }),
      Task.countDocuments({ userId, completedAt: { $gte: sevenDaysAgo } }),
      Task.countDocuments({ userId, completedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } })
    ]);

    const trends = {
      notes: getTrend(currentNotes, prevNotes),
      tasks: getTrend(currentTasks, prevTasks),
    };

    // 3. Sparkline Data (Last 7 days daily counts)
    const sparklinePipeline = (model, dateField) => [
      { $match: { userId: new mongoose.Types.ObjectId(userId), [dateField]: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } }
    ];

    const [noteSparklineRaw, taskSparklineRaw] = await Promise.all([
      Note.aggregate(sparklinePipeline('Note', 'createdAt')),
      Task.aggregate(sparklinePipeline('Task', 'completedAt'))
    ]);

    // Fill missing dates with 0 for sparklines
    const fillDates = (raw) => {
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const match = raw.find(r => r._id === dateStr);
        result.push(match ? match.count : 0);
      }
      return result;
    };

    // 4. Neural Insights
    const mostActiveCategoryRaw = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const mostActiveCategory = mostActiveCategoryRaw[0]?._id || 'General';

    const insights = [
      trends.tasks > 0 ? `You are ${trends.tasks}% more productive than last week!` : "Focus on clearing your Task Matrix today.",
      `Most active area: ${mostActiveCategory.charAt(0).toUpperCase() + mostActiveCategory.slice(1)}`,
      totalNotes > 10 ? "Neural clusters expanding. Consider archiving old blueprints." : "Knowledge vault initialized. Awaiting data nodes."
    ];

    // 5. Activity Logs (Real Activity Model)
    const activityLogs = await Activity.find({ userId })
      .sort('-timestamp')
      .limit(10)
      .select('type message timestamp category');

    res.json({
      metrics: {
        totalNotes,
        completedTasks,
        totalTasks,
        activeProjects,
        storageUsed: `${storageGBStr}GB / 5GB`,
        taskCompletion: totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0,
        trends,
        sparklines: {
          notes: fillDates(noteSparklineRaw),
          tasks: fillDates(taskSparklineRaw)
        }
      },
      insights,
      activityLogs
    });
  } catch (error) {
    console.error('❌ Analytics Failure:', error);
    res.status(500).json({ message: 'Neural Telemetry Failure' });
  }
});

/**
 * GET /api/analytics/velocity (Weekly Recharts Activity)
 */
router.get('/velocity', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const tasks = await Task.aggregate([
      { $match: { userId, completed: true, updatedAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } }
    ]);

    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = tasks.find(t => t._id === dateStr);
      dates.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: match ? match.count : 0
      });
    }
    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load velocity analytics' });
  }
});

/**
 * GET /api/analytics/distribution (Task Priority Matrix Distribution)
 */
router.get('/distribution', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const distribution = await Task.aggregate([
      { $match: { userId, completed: false } },
      { $group: { _id: "$priority", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);
    res.json(distribution);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load distribution' });
  }
});

/**
 * GET /api/analytics/storage
 * Aggregates asset sizes by category
 */
router.get('/storage', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const storageData = await Asset.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", value: { $sum: { $divide: ["$size", 1024 * 1024] } } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);
    res.json(storageData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load storage analytics' });
  }
});

/**
 * GET /api/analytics/overview
 * Global user metrics
 */
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const [notes, assets, teams, tasks] = await Promise.all([
      Note.countDocuments({ userId }),
      Asset.countDocuments({ userId }),
      Team.countDocuments({ 'members.user': userId }),
      Task.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: ["$completed", 1, 0] } } } }
      ])
    ]);

    const stats = tasks[0] || { total: 0, completed: 0 };
    const completionPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    res.json({
      totalNotes: notes,
      totalAssets: assets,
      totalTeamMembers: teams,
      projectCompletionPercent: completionPercent
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load analytics overview' });
  }
});

/**
 * GET /api/analytics/heatmap
 * Aggregates task completions by date for the last 6 months
 */
router.get('/heatmap', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const heatmapData = await Task.aggregate([
      { 
        $match: { 
          userId, 
          completed: true, 
          completedAt: { $gte: sixMonthsAgo } 
        } 
      },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format as { "2023-10-01": 5, ... }
    const formatted = heatmapData.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate neural heatmap' });
  }
});

/**
 * GET /api/analytics/suggestions
 * Provides intelligent task recommendations
 */
router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    // 1. Get high priority tasks not completed
    const priorityTasks = await Task.find({ 
      userId, 
      completed: false, 
      priority: 'high' 
    }).limit(3);

    // 2. Get tasks due in the next 24 hours
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueSoon = await Task.find({
      userId,
      completed: false,
      dueDate: { $lte: tomorrow, $gte: new Date() }
    }).limit(3);

    const suggestions = [
      ...priorityTasks.map(t => ({ id: t._id, title: t.title, type: 'CRITICAL', reason: 'High priority mission' })),
      ...dueSoon.map(t => ({ id: t._id, title: t.title, type: 'URGENT', reason: 'Due within 24 hours' }))
    ];

    // Deduplicate and fallback
    const uniqueSuggestions = Array.from(new Set(suggestions.filter(s => s.id).map(s => s.id.toString())))
      .map(id => suggestions.find(s => s.id && s.id.toString() === id))
      .slice(0, 4);

    if (uniqueSuggestions.length === 0) {
      uniqueSuggestions.push({ title: 'Universal Alignment', type: 'NEURAL', reason: 'All objectives secured. System optimized.' });
    }

    res.json(uniqueSuggestions);
  } catch (err) {
    res.status(500).json({ message: 'Neural suggestion engine offline' });
  }
});

export default router;
