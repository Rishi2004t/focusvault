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
      // Look 1 minute back and 1 minute forward to handle clock drift
      const pastWindow = new Date(now.getTime() - 60000);
      const futureWindow = new Date(now.getTime() + 60000);

      // Find tasks due within this window that haven't been completed or notified
      const imminentTasks = await Task.find({
        dueDate: {
          $gte: pastWindow,
          $lte: futureWindow
        },
        completed: false,
        notified: { $ne: true }
      });

      if (imminentTasks.length > 0) {
        console.log(`📡 [Neural Observer] Found ${imminentTasks.length} impending tasks for notification.`);
        const io = getIO();

        for (const task of imminentTasks) {
          const smartMessage = `Observer Alert: Your urgent task '${task.title}' from project '${task.projectContext}' is due now. Synchronize your progress!`;
          
          // 1. Create Persistent Notification in DB
          await Notification.create({
            userId: task.userId,
            taskId: task._id,
            title: 'Neural Alert',
            message: smartMessage,
            type: 'TASK_REMINDER',
            data: { taskId: task._id, url: '/tasks', link: task.link }
          });

          // 2. Mark Task as notified
          task.notified = true;
          await task.save();

          // 3. Emmit via Socket.io (for active tab)
          io.to(task.userId.toString()).emit('task_due', {
            id: task._id,
            title: task.title,
            message: smartMessage,
            project: task.projectContext,
            priority: task.priorityMatrix,
            link: task.link
          });

          // 4. Trigger Universal Neural Web Push (for background notifications)
          console.log(`🚀 Triggering Neural Web Push for task: ${task.title}`);
          try {
            const subscriptions = await Subscription.find({ userId: task.userId });
            
            const payload = JSON.stringify({
              title: 'Neural Alert',
              body: smartMessage,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/badge-72x72.png',
              data: { taskId: task._id, url: '/tasks', link: task.link }
            });

            subscriptions.forEach(sub => {
              webpush.sendNotification(sub, payload)
                .catch(err => console.error('❌ Push failed for endpoint:', sub.endpoint.substring(0, 30)));
            });
          } catch (err) {
            console.error('❌ Web Push logic error:', err);
          }
        }
      }
    } catch (error) {
      console.error('❌ Cron Job Error:', error);
    }
  });
};
