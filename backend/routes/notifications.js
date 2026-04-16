import express from 'express';
import Notification from '../models/Notification.js';
import Subscription from '../models/Subscription.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Web Push Subscription Route
router.post('/subscribe', authMiddleware, async (req, res) => {
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

// 🧪 DIAGNOSTIC ROUTE: Trigger a test push notification immediately
router.get('/test-push', authMiddleware, async (req, res) => {
  try {
    const webpush = (await import('web-push')).default;
    const Subscription = (await import('../models/Subscription.js')).default;
    
    const subscriptions = await Subscription.find({ userId: req.userId });
    
    if (subscriptions.length === 0) {
      return res.status(404).json({ message: 'No push subscriptions found for this user. Click Enable Neural Sync first.' });
    }

    const payload = JSON.stringify({
      title: '🧪 Focus Vault: Test Signal',
      body: 'If you see this, background notifications are working perfectly!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { url: '/tasks' }
    });

    let successCount = 0;
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
        successCount++;
      } catch (err) {
        console.error('❌ Test Push failed:', err);
      }
    }

    res.json({ 
      message: `Test signal broadcasted to ${successCount} terminals.`,
      foundSubscriptions: subscriptions.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all notifications for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all as read
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
