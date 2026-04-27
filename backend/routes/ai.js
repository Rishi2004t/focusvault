import express from 'express';
import Groq from 'groq-sdk';
import { authMiddleware } from '../middleware/auth.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';

const router = express.Router();

let groq;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } else {
    console.warn('⚠️ GROQ_API_KEY is not set. Focus AI will not function properly.');
  }
} catch (error) {
  console.error('Failed to initialize Groq SDK:', error);
}

// System prompt enforcing the persona of "Focus AI"
const SYSTEM_PROMPT = `
You are "Focus AI", an intelligent, concise, and helpful assistant integrated into the "FocusVault" platform.
FocusVault is a premium productivity app featuring note taking (Neural Notes), task management (Daily Planner / Focus Mode), file storage (Asset Vault), and team collaboration.
Keep your responses relatively short, easy to read, and geared toward productivity and helping the user.
Avoid markdown if possible, just use standard paragraphs or bullet points seamlessly.
`;

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!groq) {
      return res.status(503).json({
        message: "I'm currently offline. My neural link to the Groq API (GROQ_API_KEY) is missing or invalid.",
        role: "assistant"
      });
    }

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Format history for Groq
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach(msg => {
        if (msg.role && msg.content) {
          messages.push({ role: msg.role === 'ai' ? 'assistant' : 'user', content: msg.content });
        }
      });
    }

    // Append the current message
    messages.push({ role: 'user', content: message });

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.1-8b-instant', 
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";

    res.json({
      message: aiMessage,
      role: 'assistant'
    });

  } catch (error) {
    console.error('Focus AI Error:', error);
    res.status(500).json({
      message: "There was a disruption in my neural pathways. Please try again.",
      role: "assistant"
    });
  }
});

export default router;

// Generate AI Coach Insights
router.get('/coach', authMiddleware, async (req, res) => {
  try {
    if (!groq) {
      return res.status(503).json({
        message: "Neural link offline.",
        insights: []
      });
    }

    const userId = req.userId;

    // Fetch user data for context
    const recentTasks = await Task.find({ userId }).sort('-updatedAt').limit(20);
    const completedTasksCount = await Task.countDocuments({ userId, completed: true });
    const pendingTasksCount = await Task.countDocuments({ userId, completed: false });
    const recentActivity = await Activity.find({ userId }).sort('-timestamp').limit(10);

    const prompt = `
You are an expert AI productivity coach analyzing a user's data.
Based on the following data:
- Recent Tasks: ${JSON.stringify(recentTasks.map(t => ({ title: t.title, completed: t.completed, priority: t.priority })))}
- Total Completed: ${completedTasksCount}
- Total Pending: ${pendingTasksCount}
- Recent Activity: ${JSON.stringify(recentActivity.map(a => a.message))}

Generate exactly 3 personalized productivity insights.
Return ONLY a valid JSON array of 3 objects with these exact keys:
- "id": number (1, 2, 3)
- "icon": string (a single emoji)
- "color": string (Tailwind gradient classes, e.g., "from-amber-400 to-orange-500", "from-violet-500 to-purple-600", "from-emerald-400 to-teal-500", "from-rose-400 to-pink-500", "from-sky-400 to-blue-500")
- "glowColor": string (RGBA color matching the theme, e.g., "rgba(251,191,36,0.15)", "rgba(139,92,246,0.15)", "rgba(52,211,153,0.15)", "rgba(251,113,133,0.15)", "rgba(56,189,248,0.15)")
- "borderColor": string (RGBA color matching the theme, e.g., "rgba(251,191,36,0.2)", "rgba(139,92,246,0.2)", "rgba(52,211,153,0.2)", "rgba(251,113,133,0.2)", "rgba(56,189,248,0.2)")
- "badge": string (Short category like "Peak Hours", "Attention Span")
- "badgeColor": string (Tailwind classes, e.g., "bg-amber-500/10 text-amber-600 border-amber-500/20")
- "title": string (A punchy title for the insight)
- "detail": string (A brief 1-sentence explanation)
- "actionLabel": string (Short label for a button, e.g., "View Analytics", "Start Focus Mode")
- "actionPath": string (URL path, e.g., "/tasks", "/analytics", "/focus", "/replay")
- "confidence": number (An integer between 80 and 99 representing confidence)

DO NOT INCLUDE ANY MARKDOWN CODE BLOCKS OR EXTRA TEXT. JUST THE RAW JSON ARRAY.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiMessage = completion.choices[0]?.message?.content || "[]";
    let insights = [];
    
    try {
      // Clean up markdown if the model hallucinates it
      const jsonString = aiMessage.replace(/^```json/i, '').replace(/```$/i, '').trim();
      insights = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('Failed to parse Groq JSON response:', aiMessage);
      // Fallback insights
      insights = [
        {
          id: 1,
          icon: '🤖',
          color: 'from-amber-400 to-orange-500',
          glowColor: 'rgba(251,191,36,0.15)',
          borderColor: 'rgba(251,191,36,0.2)',
          badge: 'System Offline',
          badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          title: 'Neural Parsing Error',
          detail: 'Failed to interpret AI response. Standard protocols engaged.',
          actionLabel: 'Check Tasks',
          actionPath: '/tasks',
          confidence: 50,
        }
      ];
    }

    res.json({ insights });

  } catch (error) {
    console.error('Focus AI Coach Error:', error);
    res.status(500).json({
      message: "There was a disruption in my neural pathways.",
      insights: []
    });
  }
});
