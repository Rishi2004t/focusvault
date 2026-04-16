import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import NotificationPopup from '../components/shared/NotificationPopup';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeNotification, setActiveNotification] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const API = import.meta.env.VITE_API_URL || 'https://backend-06et.onrender.com';
      const socketUrl = API; // No need to replace /api anymore as we fixed the env var logic

      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      setSocket(newSocket);

      newSocket.emit('join_user', user.id || user._id);

      newSocket.on('task_due', (data) => {
        console.log('⏰ Task Due:', data);
        
        // Show in-app mission alert popup
        setActiveNotification(data);

        // Also show a toast as fallback/secondary alert
        toast.info(data.message, {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          icon: "🧠",
        });

        // Hide notification popup after 10 seconds
        setTimeout(() => {
          setActiveNotification(prev => prev?.id === data.id ? null : prev);
        }, 10000);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
      <NotificationPopup 
        notification={activeNotification} 
        onClose={() => setActiveNotification(null)} 
      />
    </SocketContext.Provider>
  );
};
