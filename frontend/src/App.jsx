import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { SilkProvider } from './components/SilkBackground';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/NotesPage';
import TasksPage from './pages/TasksPage';
import NoteEditor from './pages/NoteEditor';
import FileManager from './pages/FileManager';
import AssetVault from './pages/AssetVault';
import TeamSpace from './pages/TeamSpace';
import DailyPlanner from './pages/DailyPlanner';
import FocusMode from './pages/FocusMode';
import NeuralGraph from './pages/NeuralGraph';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ProjectsPage from './pages/ProjectsPage';
import FocusModePage from './pages/FocusModePage';
import NeuralIDE from './pages/NeuralIDE';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SoulVault from './pages/SoulVault';
import LoadingSpinner from './components/LoadingSpinner';
import FocusAI from './components/FocusAI';
import { useNotifications } from './hooks/useNotifications';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { isAuthenticated, loading, user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Neural Web Push Sync
  useNotifications(isAuthenticated);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  useEffect(() => {
    // Sync with user preference from backend
    if (user?.darkMode !== undefined) {
      setDarkMode(user.darkMode);
      applyTheme(user.darkMode);
    }
  }, [user]);

  const applyTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resettoken" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <ProjectsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/notes"
        element={
          <PrivateRoute>
            <NotesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/notes/:id"
        element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        }
      />

      <Route
        path="/notes/new"
        element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <DailyPlanner />
          </PrivateRoute>
        }
      />

      <Route
        path="/focus"
        element={
          <PrivateRoute>
            <FocusModePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/focus/:id"
        element={
          <PrivateRoute>
            <FocusMode />
          </PrivateRoute>
        }
      />

      <Route
        path="/neural-web"
        element={
          <PrivateRoute>
            <NeuralGraph />
          </PrivateRoute>
        }
      />

      <Route
        path="/files"
        element={
          <PrivateRoute>
            <AssetVault />
          </PrivateRoute>
        }
      />

      <Route
        path="/team"
        element={
          <PrivateRoute>
            <TeamSpace />
          </PrivateRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        }
      />

      <Route
        path="/ide"
        element={
          <PrivateRoute>
            <NeuralIDE />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />

      <Route
        path="/soul"
        element={
          <PrivateRoute>
            <SoulVault />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SilkProvider>
        <AuthProvider>
          <ThemeProvider>
            <SocketProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--primary-text)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  },
                  success: { iconTheme: { primary: 'var(--accent-glow)', secondary: '#fff' } },
                  error:   { iconTheme: { primary: '#f87171', secondary: '#fff' } },
                }}
              />
              <AppRoutes />
              <FocusAI />
            </SocketProvider>
          </ThemeProvider>
        </AuthProvider>
      </SilkProvider>
    </Router>
  );
}
