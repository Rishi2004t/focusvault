import express from 'express';
import Groq from 'groq-sdk';
import { authMiddleware } from '../middleware/auth.js';

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
