import Log from '../models/Log.js';
import Activity from '../models/Activity.js';
import { getIO } from './socket.js';

/**
 * Logs a message to the database and emits it via Socket.io
 * @param {string} message - The log message string
 * @param {string} type - Log level type ('info', 'error', 'warning', 'success', 'system')
 * @param {object} metadata - Additional context payload
 */
export const logToConsole = async (message, type = 'info', metadata = {}) => {
  try {
    // 1. Save to MongoDB
    const logEntry = new Log({ message, type, metadata });
    await logEntry.save();

    // 2. Emit to connected clients
    try {
      const io = getIO();
      if (io) {
        io.emit('system_log', {
          id: logEntry._id,
          message: logEntry.message,
          type: logEntry.type,
          timestamp: logEntry.timestamp,
          metadata: logEntry.metadata
        });
      }
    } catch (socketErr) {
      console.warn('Socket.io not initialized, log not emitted globally:', message);
    }
    
    console.log(`[${type.toUpperCase()}] ${message}`);
  } catch (err) {
    console.error('❌ Logger Error: Failed to save log entry', err);
  }
};

/**
 * Records a user activity and emits it in real-time
 */
export const recordActivity = async (userId, type, message, category = 'system', metadata = {}) => {
  try {
    const activity = new Activity({ userId, type, message, category, metadata });
    await activity.save();

    const io = getIO();
    if (io) {
      // Emit specifically to the user's room
      io.to(userId.toString()).emit('new_activity', activity);
      
      // Also emit to the system log for the console if it's a significant event
      io.emit('system_log', {
        id: activity._id,
        message: `${type}: ${message}`,
        type: category === 'neural' ? 'success' : 'info',
        timestamp: activity.timestamp
      });
    }

    // Update User XP logic here
    await syncUserXP(userId, type);

    console.log(`[ACTIVITY] User ${userId}: ${type} - ${message}`);
  } catch (err) {
    console.error('❌ Activity Record Error:', err);
  }
};

/**
 * Balanced XP Logic for Neural Leveling
 */
const syncUserXP = async (userId, activityType) => {
  const User = (await import('../models/User.js')).default;
  const Badge = (await import('../models/Badge.js')).default;
  
  let xpToAdd = 5; // Default

  switch (activityType) {
    case 'TASK_OK': xpToAdd = 50; break;
    case 'VAULT_ADD': xpToAdd = 30; break;
    case 'NOTE_CREATE': xpToAdd = 20; break;
    case 'IDE_EXEC': xpToAdd = 40; break;
    case 'NOTE_SYNC': xpToAdd = 10; break;
    case 'BREAK_SYNC': xpToAdd = 5; break;
  }

  const user = await User.findById(userId).populate('badges');
  if (user) {
    const oldXP = user.xp;
    user.xp += xpToAdd;
    // Simple leveling: level up every 500 XP
    user.productivityLevel = Math.floor(user.xp / 500) + 1;
    
    // Badge Check Logic
    const allBadges = await Badge.find({});
    const newBadges = [];
    
    for (const badge of allBadges) {
      const alreadyHas = user.badges.some(b => {
        const id = b._id ? b._id.toString() : b.toString();
        return id === badge._id.toString();
      });
      if (!alreadyHas && user.xp >= badge.minPoints) {
        user.badges.push(badge._id);
        newBadges.push(badge);
      }
    }
    
    await user.save();

    // Notify user of new badges
    if (newBadges.length > 0) {
      const io = getIO();
      if (io) {
        newBadges.forEach(badge => {
          io.to(userId.toString()).emit('badge_unlocked', {
            badge,
            message: `🚨 Neural Achievement Unlocked: ${badge.name}`
          });
        });
      }
    }
  }
};
