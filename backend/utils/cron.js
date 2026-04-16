import cron from 'node-cron';
import webpush from 'web-push';
import Task from '../models/Task.js';
import Subscription from '../models/Subscription.js';
import Notification from '../models/Notification.js';
import { getIO } from './socket.js';

export const initCronJobs = () => {
  // Check for tasks every minute
  cron.schedule('* * * * *', async () => {
    console.log('⏰ Scanning for imminent tasks...');
    
    try {
      const now = new Date();
      const io = getIO();

      // ── STAGE 1: Early Warning — 2 minutes before due ──
      // Find tasks due in the next 2-3 minutes that haven't received stage 1 yet
      const earlyWindowStart = new Date(now.getTime() + 1 * 60000); // 1 min from now
      const earlyWindowEnd = new Date(now.getTime() + 3 * 60000);   // 3 min from now

      const earlyTasks = await Task.find({
        dueDate: { $gte: earlyWindowStart, $lte: earlyWindowEnd },
        completed: false,
        reminderStage: { $lt: 1 }
      });

      for (const task of earlyTasks) {
        const minutesLeft = Math.round((new Date(task.dueDate) - now) / 60000);
        const message = `⏳ Heads Up: Your task '${task.title}' is due in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}. Get ready!`;
        
        await sendNotification(io, task, message, 'EARLY_WARNING', 1);
      }

      // ── STAGE 2: Due Now — task is due right now (±1 min) ──
      const dueWindowStart = new Date(now.getTime() - 60000); // 1 min ago
      const dueWindowEnd = new Date(now.getTime() + 60000);   // 1 min from now

      const dueTasks = await Task.find({
        dueDate: { $gte: dueWindowStart, $lte: dueWindowEnd },
        completed: false,
        reminderStage: { $lt: 2 }
      });

      for (const task of dueTasks) {
        const message = `🚨 NOW: Your task '${task.title}' is due RIGHT NOW! Time to execute.`;
        
        await sendNotification(io, task, message, 'TASK_DUE_NOW', 2);
      }

      // ── STAGE 3: Overdue — 1 minute after due time ──
      const overdueWindowStart = new Date(now.getTime() - 3 * 60000); // 3 min ago
      const overdueWindowEnd = new Date(now.getTime() - 1 * 60000);   // 1 min ago

      const overdueTasks = await Task.find({
        dueDate: { $gte: overdueWindowStart, $lte: overdueWindowEnd },
        completed: false,
        reminderStage: { $lt: 3 }
      });

      for (const task of overdueTasks) {
        const message = `🔴 OVERDUE: Your task '${task.title}' is past its deadline! Complete it now before it slips further.`;
        
        await sendNotification(io, task, message, 'TASK_OVERDUE', 3);
      }

    } catch (error) {
      console.error('❌ Cron Job Error:', error);
    }
  });
};

// ── Unified Notification Sender ──
async function sendNotification(io, task, message, type, stage) {
  try {
    const now = new Date();
    console.log(`[Cron] 🎯 DETECTED: Stage ${stage} for "${task.title}"`);
    console.log(`[Cron] Server Time (UTC): ${now.toISOString()}`);
    console.log(`[Cron] Task Due (UTC): ${new Date(task.dueDate).toISOString()}`);

    // 1. Save to DB
    await Notification.create({
      userId: task.userId,
      taskId: task._id,
      title: stage === 1 ? 'Early Warning' : stage === 2 ? 'Task Due Now' : 'Task Overdue',
      message,
      type,
      data: { taskId: task._id, url: '/tasks', link: task.link }
    });

    // 2. Update reminder stage
    task.reminderStage = stage;
    await task.save();

    // 3. Socket.io real-time push (for active tab)
    if (io) {
      io.to(task.userId.toString()).emit('task_due', {
        id: task._id,
        title: task.title,
        message,
        project: task.projectContext,
        priority: task.priorityMatrix,
        link: task.link,
        stage
      });
    }

    // 4. Web Push (for background/closed browser)
    try {
      const subscriptions = await Subscription.find({ userId: task.userId });
      console.log(`[Cron] Found ${subscriptions.length} push subscriptions for user ${task.userId}`);
      
      const payload = JSON.stringify({
        title: stage === 1 ? '⏳ Task Coming Up' : stage === 2 ? '🚨 Task Due Now' : '🔴 Task Overdue',
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        data: { taskId: task._id, url: '/tasks', link: task.link }
      });

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(sub, payload);
          console.log(`   ✅ Push SUCCESS for endpoint: ...${sub.endpoint.slice(-30)}`);
        } catch (err) {
          console.error(`   ❌ Push FAILED: ${err.statusCode || 'Unknown'} - ${err.message}`);
          if (err.statusCode === 410 || err.statusCode === 404) {
             await Subscription.findByIdAndDelete(sub._id);
             console.log('      🗑️ Deleted expired subscription.');
          }
        }
      }
    } catch (err) {
      console.error('❌ Web Push logic error:', err);
    }

    console.log(`📡 [Stage ${stage}] Process complete for: ${task.title}`);
  } catch (err) {
    console.error(`❌ Critical failure in stage ${stage} notification:`, err);
  }
}
