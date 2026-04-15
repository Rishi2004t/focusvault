import express from 'express';
import { body, validationResult } from 'express-validator';
import Note from '../models/Note.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Asset from '../models/Asset.js';
import { authMiddleware } from '../middleware/auth.js';
import { recordActivity } from '../utils/logger.js';

const router = express.Router();

// Get All Notes (with filtering and search)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, category, tag, sort = '-createdAt' } = req.query;

    let query = { userId: req.userId };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    const notes = await Note.find(query).sort(sort).limit(100);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Note
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId })
      .populate('assets')
      .populate('projectId');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Note
router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, tags, category, color, isFavorite, isCompleted, type, todoItems, projectId } = req.body;

      const note = new Note({
        userId: req.userId,
        title,
        content: content || '',
        tags: tags || [],
        category: category || 'work',
        color: color || '#ffffff',
        isFavorite: isFavorite || false,
        isCompleted: isCompleted || false,
        type: type || 'standard',
        todoItems: todoItems || [],
        projectId: projectId || null,
      });

      await note.save();

      // Record activity (automatically handles XP and Socket sync)
      await recordActivity(
        req.userId, 
        'NOTE_CREATE', 
        `New note created: "${title}"`, 
        'work', 
        { noteId: note._id }
      );

      res.status(201).json({ message: 'Note created', note });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update Note
router.put(
  '/:id', 
  authMiddleware, 
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().isIn(['work', 'neural', 'personal', 'blueprint']).withMessage('Invalid category')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { title, content, tags, category, color, isPinned, isCompleted, isFavorite, type, todoItems, projectId } = req.body;

    const wasCompleted = note.isCompleted;

    if (title) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags) note.tags = tags;
    if (category) note.category = category;
    if (color) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isFavorite !== undefined) note.isFavorite = isFavorite;
    if (isCompleted !== undefined) note.isCompleted = isCompleted;
    if (type) note.type = type;
    if (todoItems) note.todoItems = todoItems;
    if (projectId !== undefined) note.projectId = projectId;

    // Record activity if completion was toggled to true
    if (isCompleted === true && !wasCompleted) {
      await recordActivity(
        req.userId, 
        'NOTE_SYNC', 
        `Note "${note.title}" archived/completed.`, 
        'work', 
        { noteId: note._id }
      );
    }

    note.lastSavedAt = new Date();
    await note.save();
    res.json({ message: 'Note updated', note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Note (Robust Deletion Flow with Cascading Deletes)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // 1. Delete all associated tasks (preventing orphaned data)
    await Task.deleteMany({ notesId: req.params.id, userId: req.userId });
    
    // 2. Delete all associated asset documents (actual files remain for now, but link is severed)
    await Asset.deleteMany({ noteId: req.params.id, userId: req.userId });

    // 3. Delete the note itself
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Neural cluster and related tasks purged from vault' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
