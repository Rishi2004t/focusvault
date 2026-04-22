import express from 'express';
import Team from '../models/Team.js';
import { authMiddleware } from '../middleware/auth.js';
import { getIO } from '../utils/socket.js';

const router = express.Router();

/**
 * @desc Add a code snippet to a team vault
 * @route POST /api/snippets
 * @payload { teamId, title, language, code }
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { teamId, title, language, code } = req.body;

    if (!teamId || !title || !code) {
      return res.status(400).json({ message: 'TeamID, Title, and Code are required parameters.' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Target Squad not found.' });
    }

    // Verify membership
    const isMember = team.members.some(m => m.userId.toString() === req.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this squad.' });
    }

    const snippet = {
      title,
      language: language || 'javascript',
      code,
      addedBy: req.userId,
      createdAt: new Date()
    };

    team.codeSnippets.push(snippet);
    await team.save();

    // Broadcast update via Socket.io
    try {
      getIO().to(`team_${teamId}`).emit('collab_log', {
        type: 'SNIPPET_ADD',
        message: `New snippet "${title}" synchronized to vault.`
      });
    } catch (socketErr) {
      console.warn('⚠️ Socket broadcast failed for snippet addition:', socketErr.message);
    }

    console.log(`✅ Snippet "${title}" added to Team ${teamId} by ${req.userId}`);
    res.status(201).json(snippet);
  } catch (error) {
    console.error('❌ Snippet creation error:', error);
    res.status(500).json({ message: 'Neural Sync Failure: Unable to store snippet.', error: error.message });
  }
});

export default router;
