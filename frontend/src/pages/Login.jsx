import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Access Granted! 🚀');
      navigate('/dashboard');
    } catch (error) {
      console.error('Authorization failure:', error);
      toast.error(error.parsedMessage || 'Unauthorized access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-neon-blue/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue shadow-neon-glow mb-6"
          >
            <ShieldCheck size={32} className="text-white" />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
            Focus<span className="neon-text-purple">Vault</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            The Ultimate Second Brain
          </p>
        </div>

        <GlassCard className="border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-neon-purple" size={18} />
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

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Credentials</label>
               <Link to="/forgot-password" title="Initiate neural reset protocol" className="text-[10px] font-bold text-neon-blue hover:text-white transition-colors uppercase tracking-widest">
                 Forgot Path?
               </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-neon-blue" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-neon pl-12"
                required
              />
            </div>
          </div>

          <NeonButton
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                Authorize Session
              </>
            )}
          </NeonButton>

          {/* Social Authentication Matrix */}
          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
             </div>
             <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                <span className="bg-[#0f172a] px-4 text-slate-600 italic">Neural Bridging</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <a 
               href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
               className="flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
             >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Google</span>
             </a>
             <a 
               href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`}
               className="flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
             >
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="w-5 h-5 invert grayscale group-hover:grayscale-0 transition-all" alt="GitHub" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">GitHub</span>
             </a>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            New operative?{' '}
            <Link to="/signup" className="text-neon-purple font-bold hover:neon-text-purple transition-all italic">
              Initialize Account
            </Link>
          </p>
        </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
