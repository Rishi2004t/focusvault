import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors and 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    
    // Standardize error message extraction
    if (!error.response) {
      error.parsedMessage = 'Neural link disrupted: Connectivity failure.';
    } else {
      const data = error.response.data;
      // Handle the new validation error format from server.js
      if (data.errors && Array.isArray(data.errors)) {
        error.parsedMessage = data.errors.map(e => e.msg).join(' | ');
      } else {
        error.parsedMessage = data.message || 'System protocol violation detected.';
        if (!data.message) {
          console.error('🔍 Neural Protocol Violation Detected. Raw Data:', data);
          console.error('🔍 Full Error Context:', error);
        }
      }
    }

    // Don't redirect if we're already trying to login/signup
    const isAuthRoute = config.url.includes('/auth/login') || config.url.includes('/auth/signup');

    if (response?.status === 401 && !isAuthRoute) {
      console.warn('⚠️ Neural Token expired or unauthorized. Redirecting to terminal initialization...');
      localStorage.removeItem('authToken');
      // Prevent infinite redirect loops if already on login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
