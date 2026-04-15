import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import api from '../utils/api';

export default function FocusAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi there! I am Focus AI. How can I help you organize your life today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const suggestedQuestions = [
    "How does the Asset Vault work?",
    "Tips for deep work focus?",
    "How do I collaborate with my team?",
  ];

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Keep only last 5 messages for context to save tokens
      const chatHistory = messages.slice(-5);
      
      const res = await api.post('/ai/chat', { message: text, chatHistory });
      
      if (res.data && res.data.message) {
        setMessages(prev => [...prev, { role: 'ai', content: res.data.message }]);
      }
    } catch (err) {
      console.error('AI Chat Error:', err);
      // Backend automatically sends 503 if GROQ_API_KEY is missing or 500 for error, 
      // but we handle axios error fallback just in case
      const errorMessage = err.response?.data?.message || "Oops! I encountered an error. Please check your connection or GROQ_API_KEY.";
      setMessages(prev => [...prev, { role: 'ai', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] transition-all group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </motion.button>

      {/* Chat UI Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-6 sm:bottom-6 sm:right-24 z-50 w-[360px] h-[550px] max-h-[80vh] flex flex-col bg-white border border-gray-100/50 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Focus AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-auto mb-1">
                      {msg.role === 'user' ? (
                        <div className="w-full h-full bg-gray-900 text-white rounded-full flex items-center justify-center pb-0.5 shadow-sm">
                          <User size={14} />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center pb-0.5 shadow-sm">
                          <Sparkles size={14} />
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div 
                      className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-gray-900 text-white rounded-br-sm' 
                          : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>

                  </div>
                </div>
              ))}

              {/* Typing Animation */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%] gap-2 flex-row">
                    <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-auto mb-1">
                      <div className="w-full h-full bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center pb-0.5 shadow-sm">
                        <Sparkles size={14} />
                      </div>
                    </div>
                    <div className="p-4 py-5 rounded-2xl bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm flex gap-1.5 items-center">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-50 flex flex-col gap-3">
              
              {/* Suggested Questions (only show if few messages) */}
              {messages.length <= 2 && !isTyping && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {suggestedQuestions.map((q, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(q)}
                      className="whitespace-nowrap px-3 py-1.5 text-[11px] font-medium bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 border border-gray-100 rounded-full transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Focus AI..."
                  className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-900 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
                />
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white disabled:opacity-50 disabled:bg-gray-400 transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
