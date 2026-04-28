import express from 'express';
import Code from '../models/Code.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @desc Quick Save code snippet from IDE
 * @route POST /api/code/save
 */
router.post('/save', authMiddleware, async (req, res) => {
  const { fileName, content, language, teamId, projectId } = req.body;
  try {
    const newCode = new Code({
      title: fileName,
      code: content,
      language,
      teamId,
      projectId,
      ownerId: req.userId
    });
    await newCode.save();
    res.status(200).json({ message: "Code stored in MongoDB", data: newCode });
  } catch (err) {
    console.error("Save failed:", err);
    res.status(500).json({ error: "Database Sync Failed" });
  }
});

import axios from 'axios';

/**
 * @desc Code execution via Wandbox (confirmed reachable) → Local sim fallback
 * @route POST /api/code/run
 */
router.post('/run', authMiddleware, async (req, res) => {
  const { language, files, stdin } = req.body;
  const code = files?.[0]?.content || '';

  // ── Primary: Piston API (Highly Stable) ──────────────────────────────────────────────────────
  try {
    console.log(`🌐 Executing via Piston API: ${language}`);
    
    // Map 'c' to 'c' and 'cpp' to 'c++' if needed, piston accepts 'c' and 'c++'
    let pistonLang = language;
    if (language === 'cpp') pistonLang = 'c++';

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: pistonLang,
      version: '*',
      files: [{ content: code }],
      stdin: stdin || ''
    }, { timeout: 20000 });

    const d = response.data;
    if (d && d.run) {
      return res.json({
        run: {
          stdout: d.run.stdout || '',
          stderr: d.run.stderr || '',
          code: d.run.code,
          source: 'cloud'
        },
        statusMessage: `Executed via Piston Engine — ${d.language} ${d.version}`
      });
    }
  } catch (err) {
    console.warn('⚠️ Piston API failed:', err.message);
  }

  // ── Fallback: Local simulation (Python / JavaScript simple patterns) ──────
  const simulation = { stdout: '', stderr: '', code: 0, source: 'local_simulation' };
  if (language === 'python' || language === 'javascript') {
    const inputBuffer = (stdin || '').split(/\s+/);
    const printRegex = /(?:print|console\.log)\s*\(\s*(['"])(.*?)\1\s*\)/g;
    let match;
    while ((match = printRegex.exec(code)) !== null) simulation.stdout += match[2] + '\n';
    if (code.includes('input(') && inputBuffer.length > 0)
      simulation.stdout += `\n[Virtual] Simulated input "${inputBuffer[0]}" accepted.\n`;
    if (!simulation.stdout) simulation.stdout = 'Process finished (exit code 0)';
    return res.json({
      run: simulation,
      statusMessage: 'Cloud offline — Running in Virtual Simulation Mode'
    });
  }

  // ── All failed ────────────────────────────────────────────────────────────
  return res.status(503).json({
    error: 'All execution engines unavailable',
    details: `No engine could run ${language}. The browser will try direct execution.`,
  });
});

/**
 * @desc Get all code snippets for the logged-in user
 * @route GET /api/code
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const codes = await Code.find({ ownerId: req.userId }).sort({ updatedAt: -1 });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving code documents' });
  }
});

/**
 * @desc Create a new code snippet
 * @route POST /api/code
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, code, language, teamId, projectId } = req.body;
    
    const newCode = new Code({
      title,
      code,
      language,
      teamId,
      projectId,
      ownerId: req.userId,
    });
    
    await newCode.save();
    res.status(201).json(newCode);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create code document' });
  }
});

/**
 * @desc Update a code snippet
 * @route PUT /api/code/:id
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, code, language } = req.body;
    
    const updatedCode = await Code.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.userId },
      { title, code, language },
      { new: true }
    );
    
    if (!updatedCode) {
      return res.status(404).json({ message: 'Code document not found or unauthorized' });
    }
    
    res.json(updatedCode);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update code document' });
  }
});

/**
 * @desc Delete a code snippet
 * @route DELETE /api/code/:id
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedCode = await Code.findOneAndDelete({ _id: req.params.id, ownerId: req.userId });
    if (!deletedCode) {
      return res.status(404).json({ message: 'Code document not found or unauthorized' });
    }
    res.json({ message: 'Code deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete code document' });
  }
});

export default router;
