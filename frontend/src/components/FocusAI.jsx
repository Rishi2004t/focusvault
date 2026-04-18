import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronDown,
  Paperclip,
  Zap,
  Activity
} from 'lucide-react';
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
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-4 z-[60] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] transition-all group border border-white/20"
        >
          <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20 group-hover:opacity-40" />
          <Bot size={28} className="relative z-10" />
        </motion.button>
      )}

      {/* Chat UI Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100, x: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-[calc(100%-2rem)] sm:w-[400px] h-[650px] max-h-[90vh] sm:max-h-[80vh] flex flex-col bg-[#0f172a]/95 border border-white/10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl"
          >
            {/* ── HEADER ── */}
            <div className="relative flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f172a] shadow-[0_0_10px_#10b981]" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base tracking-tight flex items-center gap-2 italic uppercase">
                    Focus AI <span className="text-xs opacity-50 not-italic">✨</span>
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                    <Activity size={10} className="text-emerald-500" />
                    Neural Uplink Optimal
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── MESSAGES AREA ── */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 no-scrollbar custom-scrollbar bg-white/[0.02]">
               <div className="text-center mb-8 opacity-20">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Encrypted Neural Stream v4.0</p>
               </div>

              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center mt-auto mb-1 shadow-lg">
                      {msg.role === 'user' ? (
                        <div className="w-full h-full bg-slate-800 border border-white/10 text-white rounded-xl flex items-center justify-center shadow-sm">
                          <User size={16} />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                          <Bot size={16} />
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div 
                      className={`p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-lg ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-br-none border border-white/10' 
                          : 'bg-white/5 border border-white/10 backdrop-blur-md text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>

                  </div>
                </motion.div>
              ))}

              {/* Typing Animation */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex max-w-[85%] gap-3 flex-row">
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mt-auto mb-1">
                      <Zap size={16} className="animate-pulse" />
                    </div>
                    <div className="p-4 py-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-slate-400 rounded-bl-none shadow-sm flex gap-1.5 items-center">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-indigo-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-indigo-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-indigo-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} className="h-4" />
            </div>

            {/* ── INPUT AREA ── */}
            <div className="p-6 bg-white/[0.03] border-t border-white/5 flex flex-col gap-4">
              
              {/* Suggested Questions */}
              {messages.length <= 2 && !isTyping && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {suggestedQuestions.map((q, i) => (
                    <motion.button 
                      key={i}
                      whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.08)' }}
                      onClick={() => handleSend(q)}
                      className="whitespace-nowrap px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 text-slate-400 border border-white/10 rounded-xl transition-all"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="relative flex items-center group">
                <div className="absolute left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Zap size={16} />
                </div>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Focus AI..."
                  className="w-full bg-white/5 border border-white/10 text-sm text-white rounded-2xl py-4 pl-12 pr-14 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500 font-bold"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2.5 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white disabled:opacity-30 disabled:hover:scale-100 shadow-lg shadow-indigo-600/20 active:shadow-none transition-all"
                >
                  <Send size={16} className="ml-0.5" />
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 italic mt-1">
                 <span>Privacy Secured</span>
                 <div className="w-1 h-1 rounded-full bg-slate-700" />
                 <span>LLM Initialized</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
