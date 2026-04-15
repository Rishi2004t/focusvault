import express from 'express';
import Project from '../models/Project.js';
import Note from '../models/Note.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET all projects for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    let projects = await Project.find({ userId: req.userId });
    
    // Seed initial data-first projects if none exist for a professional demo
    if (projects.length === 0) {
      const demoProjects = [
        {
          userId: req.userId,
          title: 'E-Commerce Backend Refactor',
          status: 'In Review',
          priority: 'Critical',
          taskCount: 18,
          completedTasks: 12,
          nextMilestone: 'API Documentation',
          milestoneDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          team: [
            { name: 'Rahul K.', avatar: 'https://i.pravatar.cc/150?u=rahul' },
            { name: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?u=sarah' },
            { name: 'Mike D.', avatar: 'https://i.pravatar.cc/150?u=mike' }
          ],
          activityLog: [
            { date: 'Mon', value: 30 },
            { date: 'Tue', value: 45 },
            { date: 'Wed', value: 25 },
            { date: 'Thu', value: 60 },
            { date: 'Fri', value: 35 },
            { date: 'Sat', value: 10 },
            { date: 'Sun', value: 20 }
          ]
        },
        {
          userId: req.userId,
          title: 'Mobile App v2.0 UI Kit',
          status: 'In Development',
          priority: 'High',
          taskCount: 24,
          completedTasks: 8,
          nextMilestone: 'Design System Handover',
          milestoneDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          team: [
            { name: 'Elena V.', avatar: 'https://i.pravatar.cc/150?u=elena' },
            { name: 'Chris P.', avatar: 'https://i.pravatar.cc/150?u=chris' }
          ],
          activityLog: [
            { date: 'Mon', value: 10 },
            { date: 'Tue', value: 15 },
            { date: 'Wed', value: 40 },
            { date: 'Thu', value: 30 },
            { date: 'Fri', value: 50 },
            { date: 'Sat', value: 55 },
            { date: 'Sun', value: 45 }
          ]
        },
        {
          userId: req.userId,
          title: 'Q3 Security Audit & Compliance',
          status: 'Testing',
          priority: 'Medium',
          taskCount: 12,
          completedTasks: 9,
          nextMilestone: 'GDPR Verification',
          milestoneDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
          team: [
            { name: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=alex' },
            { name: 'Tom H.', avatar: 'https://i.pravatar.cc/150?u=tom' }
          ],
          activityLog: [
            { date: 'Mon', value: 20 },
            { date: 'Tue', value: 20 },
            { date: 'Wed', value: 25 },
            { date: 'Thu', value: 22 },
            { date: 'Fri', value: 40 },
            { date: 'Sat', value: 15 },
            { date: 'Sun', value: 12 }
          ]
        }
      ];
      projects = await Project.insertMany(demoProjects);
    }
    
    // Requirement 2: Augment projects with real-time note counts
    const projectsWithNotes = await Promise.all(projects.map(async (project) => {
      const noteCount = await Note.countDocuments({ projectId: project._id });
      return { ...project.toObject(), noteCount };
    }));
    
    res.json(projectsWithNotes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// GET telemetry for live sync status
router.get('/latency', authMiddleware, (req, res) => {
  // Simulate database latency telemetry
  const latency = Math.floor(Math.random() * 15) + 15; // 15-30ms
  res.json({ latency, status: 'Connected' });
});

// POST new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      userId: req.userId
    });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error: error.message });
  }
});

export default router;
