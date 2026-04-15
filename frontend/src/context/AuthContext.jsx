import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    // Check for OAuth tokens in URL (from Google/Github redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    const userParam = urlParams.get('user');

    if (tokenParam && userParam) {
      localStorage.setItem('authToken', tokenParam);
      localStorage.setItem('user', userParam);
      setToken(tokenParam);
      setUser(JSON.parse(userParam));
      
      // Clean up URL without triggering a page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('authToken');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { username, email, password });
      const { token, user } = response.data;
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        // Token is handled by HttpOnly cookie, but fallback logic might need it
        if (token) localStorage.setItem('authToken', token);
      }
      return response.data;
    } catch (error) {
      console.error('Signup rejection:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        if (token) localStorage.setItem('authToken', token);
      }
      return response.data;
    } catch (error) {
      console.error('Login rejection:', error);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
       console.error('Recovery failure:', error);
       throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      const { user, token: authToken } = response.data;
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        if (authToken) localStorage.setItem('authToken', authToken);
      }
      return response.data;
    } catch (error) {
      console.error('Reset failure:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);
      if (response.data?.user) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      console.error('Profile update failure:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        fetchUserProfile,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
