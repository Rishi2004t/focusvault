import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Recovery sequence dispatched 📡');
    } catch (error) {
      toast.error(error.parsedMessage || 'Neural reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8">
           <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              <ArrowLeft size={14} /> Back to Terminal
           </Link>
        </div>

        <GlassCard className="p-8 border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">
              Forgot <span className="neon-text-blue">Path?</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Initiate neural reset protocol via encrypted email
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Registered Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-neon-blue transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@focusvault.com"
                    className="input-neon pl-12"
                    required
                  />
                </div>
              </div>

              <NeonButton
                type="submit"
                disabled={loading}
                className="w-full py-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={18} />
                    Submit Protocol
                  </>
                )}
              </NeonButton>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-neon-glow">
                  <Zap size={24} className="text-neon-blue animate-pulse" />
               </div>
               <div>
                  <h3 className="text-white font-bold mb-2">Sequence Dispatched</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    A secure link has been sent to <span className="text-white">{email}</span>. Click the link within 10 minutes to reset your access credentials.
                  </p>
               </div>
               <Link to="/login" className="block w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  Return to Login
               </Link>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
