import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Note from '../models/Note.js';
import Task from '../models/Task.js';
import Asset from '../models/Asset.js';

const router = express.Router();

/**
 * GET /api/search
 * Unified cross-model search (Notes, Tasks, Files)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ results: [] });

    const userId = req.userId;
    const regex = new RegExp(q, 'i');

    // Perform concurrent search across models
    const [notes, tasks, assets] = await Promise.all([
      Note.find({ userId, $or: [{ title: regex }, { content: regex }] }).limit(5).select('title updatedAt category'),
      Task.find({ userId, title: regex }).limit(5).select('title completed priority updatedAt'),
      Asset.find({ userId, filename: regex }).limit(5).select('filename fileType url size createdAt')
    ]);

    // Format results with types
    const results = [
      ...notes.map(n => ({ id: n._id, title: n.title, type: 'note', meta: n.category, date: n.updatedAt, path: `/notes/${n._id}` })),
      ...tasks.map(t => ({ id: t._id, title: t.title, type: 'task', meta: t.completed ? 'Completed' : t.priority, date: t.updatedAt, path: '/tasks' })),
      ...assets.map(a => ({ id: a._id, title: a.filename, type: 'file', meta: a.fileType, date: a.createdAt, path: '/files' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(results);
  } catch (err) {
    console.error('❌ Global Search Error:', err);
    res.status(500).json({ message: 'Search Engine Offline' });
  }
});

export default router;
