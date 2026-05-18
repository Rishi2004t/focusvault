import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldAlert, Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

// ── Forgot-password step identifiers ──
const STEP_ANSWER = 'answer';
const STEP_NEW_PW = 'new_password';

// ── Shared card wrapper ──
const Card = ({ children, isShaking }) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
    <motion.div
      animate={isShaking ? { x: [-10, 10, -8, 8, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-purple-500/5 blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  </div>
);

// ── Password input with show/hide toggle ──
const PasswordField = ({ label, placeholder, value, onChange, onKeyDown, autoFocus, focusColor = 'indigo' }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] block mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          className={`w-full px-4 py-3 pr-12 rounded-xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] outline-none focus:border-${focusColor}-400 transition-colors text-sm font-bold text-[var(--primary-text)]`}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ──
export default function MoodLock({ isSetup, onUnlock }) {
  // isSetup=true  → first-time setup
  // isSetup=false → unlock mode

  // Setup fields
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Unlock field
  const [unlockPw, setUnlockPw] = useState('');

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(STEP_ANSWER);
  const [fetchedQuestion, setFetchedQuestion] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [newPw, setNewPw] = useState('');

  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const shake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // ── Setup handler ──
  const handleSetup = async () => {
    if (!password) return toast.error('Enter a password');
    if (password.length < 4) return toast.error('Password must be at least 4 characters');
    if (password !== confirmPw) return toast.error('Passwords do not match');
    if (!question.trim()) return toast.error('Security question is required');
    if (!answer.trim()) return toast.error('Security answer is required');

    setLoading(true);
    try {
      await api.post('/soul/setup-password', {
        password,
        securityQuestion: question.trim(),
        securityAnswer: answer.trim(),
      });
      toast.success('Soul Vault sealed 🔐');
      onUnlock();
    } catch (err) {
      shake();
      toast.error(err.response?.data?.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Unlock handler ──
  const handleUnlock = async () => {
    if (!unlockPw) return toast.error('Enter your password');
    setLoading(true);
    try {
      await api.post('/soul/unlock', { password: unlockPw });
      toast.success('Soul Vault unlocked ✨');
      onUnlock();
    } catch (err) {
      shake();
      toast.error(err.response?.data?.message || 'Incorrect password');
      setUnlockPw('');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot: Step 0 — fetch question ──
  const handleForgotStart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/soul/question');
      setFetchedQuestion(data.question);
      setForgotMode(true);
      setForgotStep(STEP_ANSWER);
    } catch (err) {
      toast.error(err.response?.data?.message || 'No security question found. Contact support.');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot: Step 1 — verify answer ──
  const handleVerifyAnswer = async () => {
    if (!answerInput.trim()) return toast.error('Answer is required');
    setLoading(true);
    try {
      await api.post('/soul/verify-answer', { answer: answerInput });
      toast.success('Identity verified ✓');
      setForgotStep(STEP_NEW_PW);
    } catch (err) {
      shake();
      toast.error(err.response?.data?.message || 'Incorrect answer');
      setAnswerInput('');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot: Step 2 — reset password ──
  const handleResetPassword = async () => {
    if (!newPw) return toast.error('Enter a new password');
    if (newPw.length < 4) return toast.error('Password must be at least 4 characters');
    setLoading(true);
    try {
      await api.post('/soul/reset-password', { newPassword: newPw });
      toast.success('Password reset! You can now unlock your vault.');
      setForgotMode(false);
      setForgotStep(STEP_ANSWER);
      setAnswerInput('');
      setNewPw('');
      setUnlockPw('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelForgot = () => {
    setForgotMode(false);
    setForgotStep(STEP_ANSWER);
    setAnswerInput('');
    setNewPw('');
  };

  // ════════════════════════════════════════
  //  FORGOT PASSWORD MODAL
  // ════════════════════════════════════════
  if (forgotMode) {
    return (
      <Card isShaking={isShaking}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <button
            onClick={cancelForgot}
            className="w-9 h-9 rounded-xl bg-[var(--bg-silk)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h2 className="text-lg font-black text-[var(--primary-text)] tracking-tight">Forgot Password</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">
              {forgotStep === STEP_ANSWER ? 'Step 1 of 2 · Verify Identity' : 'Step 2 of 2 · Set New Password'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-[var(--glass-border)] mb-7 overflow-hidden">
          <motion.div
            className="h-full bg-purple-500 rounded-full"
            animate={{ width: forgotStep === STEP_ANSWER ? '50%' : '100%' }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Answer ── */}
          {forgotStep === STEP_ANSWER && (
            <motion.div
              key="answer-step"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="space-y-5"
            >
              {/* Security question display */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-1.5">
                  Security Question
                </p>
                <p className="text-sm font-semibold text-[var(--primary-text)] italic leading-relaxed">
                  {fetchedQuestion}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] block mb-2">
                  Your Answer
                </label>
                <input
                  type="text"
                  placeholder="Type your answer..."
                  value={answerInput}
                  onChange={e => setAnswerInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyAnswer()}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] outline-none focus:border-purple-400 transition-colors text-sm font-bold text-[var(--primary-text)]"
                />
                <p className="text-[10px] text-[var(--muted-text)] mt-1.5 ml-1">Answer is case-insensitive</p>
              </div>

              <button
                onClick={handleVerifyAnswer}
                disabled={loading || !answerInput.trim()}
                className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Answer →'}
              </button>
            </motion.div>
          )}

          {/* ── Step 2: New Password ── */}
          {forgotStep === STEP_NEW_PW && (
            <motion.div
              key="newpw-step"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Identity verified! Set your new Soul Vault password.
                </p>
              </div>

              <PasswordField
                label="New Password"
                placeholder="Enter new password..."
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                autoFocus
                focusColor="emerald"
              />

              <button
                onClick={handleResetPassword}
                disabled={loading || !newPw}
                className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-[var(--primary-text)] text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password 🔐'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }

  // ════════════════════════════════════════
  //  SETUP MODE  (first-time)
  // ════════════════════════════════════════
  if (isSetup) {
    return (
      <Card isShaking={isShaking}>
        {/* Icon + title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-indigo-50 border border-indigo-100 text-indigo-500 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400">
            <ShieldAlert size={30} />
          </div>
          <h2 className="text-2xl font-black text-[var(--primary-text)] tracking-tight">Seal Your Vault</h2>
          <p className="text-[12px] font-bold text-[var(--muted-text)] mt-2 italic max-w-xs leading-relaxed">
            Create a strong password and set a recovery question to protect your private neural space.
          </p>
        </div>

        <div className="space-y-4">
          {/* Password */}
          <PasswordField
            label="Password"
            placeholder="Create a password..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />

          {/* Confirm */}
          <PasswordField
            label="Confirm Password"
            placeholder="Repeat password..."
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && document.getElementById('sq-input')?.focus()}
          />

          {/* Divider */}
          <div className="pt-1 pb-1 border-t border-[var(--glass-border)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] text-center mt-3">
              Recovery Setup
            </p>
          </div>

          {/* Security Question */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] block mb-2">
              Security Question
            </label>
            <input
              id="sq-input"
              type="text"
              placeholder="e.g. Name of your first pet?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] outline-none focus:border-indigo-400 transition-colors text-xs font-bold text-[var(--primary-text)]"
            />
          </div>

          {/* Security Answer */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] block mb-2">
              Answer <span className="font-medium normal-case text-[10px] text-[var(--muted-text)]">(case-insensitive)</span>
            </label>
            <input
              type="text"
              placeholder="Your answer..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSetup()}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] outline-none focus:border-indigo-400 transition-colors text-xs font-bold text-[var(--primary-text)]"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSetup}
            disabled={loading || !password || !confirmPw || !question || !answer}
            className="w-full py-4 mt-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[var(--primary-text)] text-white shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          >
            {loading ? 'Sealing Vault...' : 'Seal Vault 🔐'}
          </button>
        </div>
      </Card>
    );
  }

  // ════════════════════════════════════════
  //  UNLOCK MODE
  // ════════════════════════════════════════
  return (
    <Card isShaking={isShaking}>
      {/* Icon + title */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-slate-50 border border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
          <Lock size={30} />
        </div>
        <h2 className="text-2xl font-black text-[var(--primary-text)] tracking-tight">Unlock Soul Vault</h2>
        <p className="text-[12px] font-bold text-[var(--muted-text)] mt-2 italic max-w-xs">
          Enter your Soul Vault password to access your private space.
        </p>
      </div>

      <div className="space-y-5">
        <PasswordField
          label="Password"
          placeholder="Enter your password..."
          value={unlockPw}
          onChange={e => setUnlockPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUnlock()}
          autoFocus
        />

        <button
          onClick={handleUnlock}
          disabled={loading || !unlockPw}
          className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-[var(--primary-text)] text-white shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
        >
          {loading ? 'Unlocking...' : 'Unlock Vault'}
        </button>

        {/* Forgot Password */}
        <div className="pt-1 text-center">
          <button
            onClick={handleForgotStart}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors disabled:opacity-50"
          >
            <KeyRound size={12} />
            Forgot Password?
          </button>
        </div>
      </div>
    </Card>
  );
}
