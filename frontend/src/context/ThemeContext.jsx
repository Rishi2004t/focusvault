import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [theme, setThemeState] = useState(localStorage.getItem('vault-theme') || 'perpetuity');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vault-theme', theme);
  }, [theme]);

  // Sync theme from user profile on load
  useEffect(() => {
    if (user?.preferences?.theme && user.preferences.theme !== theme) {
      setThemeState(user.preferences.theme);
    }
  }, [user]);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    if (user) {
      try {
        await updateProfile({ theme: newTheme });
      } catch (error) {
        console.error('Failed to sync theme to cloud:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
