import express from 'express';
import Team from '../models/Team.js';
import { authMiddleware } from '../middleware/auth.js';
import { getIO } from '../utils/socket.js';

const router = express.Router();

// ─── Create Team ──────────────────────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { teamName } = req.body;
    if (!teamName?.trim()) return res.status(400).json({ message: 'Team name is required' });

    const team = new Team({
      teamName: teamName.trim(),
      adminId: req.userId,
      members: [{ userId: req.userId, role: 'admin' }],
    });
    await team.save();

    const populated = await Team.findById(team._id)
      .populate('members.userId', 'username email');

    console.log(`🏗️ Team "${teamName}" created by ${req.userId} | Key: ${team.accessKey}`);
    res.status(201).json(populated);
  } catch (error) {
    console.error('❌ Team creation failed:', error);
    res.status(500).json({ message: error.message });
  }
});

// ─── Join Team via Access Key ─────────────────────────────────────────────────
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { accessKey } = req.body;
    if (!accessKey) return res.status(400).json({ message: 'Access key is required' });

    const team = await Team.findOne({ accessKey });
    if (!team) return res.status(404).json({ message: 'Invalid access key. Squad not found.' });

    const already = team.members.some(m => m.userId.toString() === req.userId);
    if (already) return res.status(400).json({ message: 'You are already a member of this squad.' });

    team.members.push({ userId: req.userId, role: 'dev' });
    await team.save();

    const populated = await Team.findById(team._id)
      .populate('members.userId', 'username email')
      .populate('sharedAssets', 'filename fileType url size');

    // Notify existing members via socket
    try {
      getIO().to(`team_${team._id}`).emit('member_joined', { userId: req.userId });
    } catch {}

    res.json(populated);
  } catch (error) {
    console.error('❌ Team join failed:', error);
    res.status(500).json({ message: error.message });
  }
});

// ─── Get All Teams for User ───────────────────────────────────────────────────
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({ 'members.userId': req.userId })
      .populate('members.userId', 'username email')
      .populate('sharedAssets', 'filename fileType url size');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── Get Single Team Workspace ────────────────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members.userId', 'username email')
      .populate('sharedAssets', 'filename fileType url size createdAt')
      .populate('messages.senderId', 'username');

    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isMember = team.members.some(m => m.userId._id.toString() === req.userId);
    if (!isMember) return res.status(403).json({ message: 'Access denied. You are not a member.' });

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── Send Chat Message ────────────────────────────────────────────────────────
router.post('/:id/message', authMiddleware, async (req, res) => {
  try {
    const { text, senderName } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Message cannot be empty' });

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const msg = { senderId: req.userId, senderName, text: text.trim(), createdAt: new Date() };
    team.messages.push(msg);

    // Limit stored messages to last 200
    if (team.messages.length > 200) team.messages = team.messages.slice(-200);
    await team.save();

    // Real-time broadcast to team room
    try {
      getIO().to(`team_${req.params.id}`).emit('team_message', msg);
    } catch {}

    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── Add Code Snippet ─────────────────────────────────────────────────────────
router.post('/:id/snippet', authMiddleware, async (req, res) => {
  try {
    const { title, language, code } = req.body;
    if (!title || !code) return res.status(400).json({ message: 'Title and code are required' });

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const snippet = { title, language: language || 'javascript', code, addedBy: req.userId };
    team.codeSnippets.push(snippet);
    await team.save();

    // Notify team via socket log
    try {
      getIO().to(`team_${req.params.id}`).emit('collab_log', {
        type: 'SNIPPET_ADD', message: `New snippet "${title}" added to vault.`
      });
    } catch {}

    res.status(201).json(snippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── Remove Member (Admin Only) ───────────────────────────────────────────────
router.delete('/:id/member/:uid', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.adminId.toString() !== req.userId) return res.status(403).json({ message: 'Only team admin can remove members.' });
    if (req.params.uid === req.userId) return res.status(400).json({ message: 'Admin cannot remove themselves.' });

    team.members = team.members.filter(m => m.userId.toString() !== req.params.uid);
    await team.save();

    res.json({ message: 'Member removed from squad.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── Regenerate Access Key ────────────────────────────────────────────────────
router.patch('/:id/regen-key', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.adminId.toString() !== req.userId) return res.status(403).json({ message: 'Admin only.' });

    const crypto = await import('crypto');
    team.accessKey = crypto.randomUUID();
    await team.save();

    res.json({ accessKey: team.accessKey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
