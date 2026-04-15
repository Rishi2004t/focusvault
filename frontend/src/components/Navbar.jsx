import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="glass-effect shadow-soft border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition-shadow">
            F
          </div>
          <span className="font-bold text-lg hidden sm:inline">FocusVault</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/notes')}
            className="px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            Notes
          </button>
          <button
            onClick={() => navigate('/tasks')}
            className="px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            Tasks
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? (
              <span className="text-xl">☀️</span>
            ) : (
              <span className="text-xl">🌙</span>
            )}
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-300 dark:border-slate-600">
            <span className="text-sm hidden sm:inline">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
