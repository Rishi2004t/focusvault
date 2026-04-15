import express from 'express';
import { body, validationResult } from 'express-validator';
import webpush from 'web-push';
import Task from '../models/Task.js';
import Note from '../models/Note.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { authMiddleware } from '../middleware/auth.js';
import { recordActivity } from '../utils/logger.js';

const router = express.Router();

// Get All Tasks (with filtering and sorting)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { priority, category, completed, sortBy = '-dueDate' } = req.query;

    let query = { userId: req.userId };

    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (completed !== undefined) query.completed = completed === 'true';

    const tasks = await Task.find(query).sort(sortBy).populate('notesId', 'title');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Task
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Task
router.post(
  '/',
  authMiddleware,
  [body('title').notEmpty().withMessage('Task title is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, priority, priorityMatrix, projectContext, dueDate, category, subtasks, notesId, projectId: manualProjectId, link } = req.body;

      let finalProjectId = manualProjectId;
      let finalProjectContext = projectContext || 'General';

      // Inheritance logic: If notesId is provided, inherit projectId for cross-contextual mapping
      if (notesId) {
        const parentNote = await Note.findOne({ _id: notesId, userId: req.userId });
        if (parentNote && parentNote.projectId) {
          finalProjectId = parentNote.projectId;
        }
      }

      const task = new Task({
        userId: req.userId,
        title,
        description,
        priority: priority || 'medium',
        priorityMatrix: priorityMatrix || 'Not-Urgent/Not-Important',
        projectContext: finalProjectContext,
        dueDate: dueDate ? new Date(dueDate) : null,
        category: category || 'personal',
        subtasks: subtasks || [],
        notesId: notesId || null,
        projectId: finalProjectId,
        link: link || null
      });

      await task.save();

      // Record activity (automatically handles XP and Socket sync)
      await recordActivity(
        req.userId, 
        'TASK_ADD', 
        `New mission launched: "${title}"`, 
        'neural',
        { taskId: task._id }
      );

      // Web Push for Mobile/Background
      try {
        const subscriptions = await Subscription.find({ userId: req.userId });
        const payload = JSON.stringify({
          title: 'Neural Alert: Mission Launched',
          body: `Mission Briefing: '${title}' has been deployed to the board. Background link synchronized.`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          data: { taskId: task._id, url: '/tasks' }
        });

        subscriptions.forEach(sub => {
          webpush.sendNotification(sub, payload).catch(e => console.error('Push error:', e));
        });
      } catch (pushErr) {
        console.error('Immediate push failure:', pushErr);
      }

      res.status(201).json({ message: 'Task created', task });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update Task
router.put(
  '/:id', 
  authMiddleware, 
  [
    body('title').optional().notEmpty().withMessage('Task title cannot be empty'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const { title, description, priority, priorityMatrix, projectContext, dueDate, completed, category, link } = req.body;

      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority) task.priority = priority;
      if (priorityMatrix) task.priorityMatrix = priorityMatrix;
      if (projectContext) task.projectContext = projectContext;
      if (dueDate) task.dueDate = new Date(dueDate);
      if (category) task.category = category;
      if (link !== undefined) task.link = link;

      if (completed !== undefined) {
        const wasCompleted = task.completed;
        task.completed = completed;
        task.completedAt = completed ? new Date() : null;

        if (completed && !wasCompleted) {
          // ── Neural Streak Calculation ──
          const user = await User.findById(req.userId);
          if (user) {
            const now = new Date();
            const lastUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null;
            
            // Normalize dates to check for "consecutive days"
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let streakIncremented = false;

            if (!lastUpdate) {
              // First time completion
              user.streak = 1;
              user.lastStreakUpdate = now;
              streakIncremented = true;
            } else {
              const lastDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
              
              if (lastDate.getTime() === yesterday.getTime()) {
                // Consecutive day!
                user.streak += 1;
                user.lastStreakUpdate = now;
                streakIncremented = true;
              } else if (lastDate.getTime() < yesterday.getTime()) {
                // Break in streak, reset to 1
                user.streak = 1;
                user.lastStreakUpdate = now;
                streakIncremented = true;
              }
              // If lastDate === today, already updated for today, don't increment.
            }

            await user.save();
            
            // Record activity (automatically handles XP and Socket sync)
            await recordActivity(
              req.userId, 
              'TASK_OK', 
              `Objective secured: "${task.title}"${streakIncremented ? ` | Streak: ${user.streak}🔥` : ''}`, 
              'neural',
              { taskId: task._id, streak: user.streak }
            );
          }

          // Mission Accomplished Push
          try {
            const subscriptions = await Subscription.find({ userId: req.userId });
            const payload = JSON.stringify({
              title: 'Neural Alert: Mission Accomplished',
              body: `Objective Secured: '${task.title}' has been successfully archived. +50 XP synchronized.`,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/badge-72x72.png',
              data: { taskId: task._id, url: '/tasks' }
            });

            subscriptions.forEach(sub => {
              webpush.sendNotification(sub, payload).catch(e => console.error('Push error:', e));
            });
          } catch (pushErr) {
            console.error('Completion push failure:', pushErr);
          }
        }
      }

      await task.save();
      res.json({ message: 'Task updated', task });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete Task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle Subtask
router.patch('/:id/subtask/:subtaskIndex', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const index = parseInt(req.params.subtaskIndex);
    if (isNaN(index) || index < 0 || index >= task.subtasks.length) {
      return res.status(400).json({ message: 'Invalid subtask index' });
    }

    task.subtasks[index].completed = !task.subtasks[index].completed;

    await task.save();
    res.json({ message: 'Subtask toggled', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Subtask
router.post('/:id/subtask', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.subtasks.push({ title, completed: false });
    await task.save();
    res.json({ message: 'Subtask added', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
