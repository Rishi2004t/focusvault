import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.startsWith('/')
        ? window.location.origin
        : (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      setSocket(newSocket);

      newSocket.emit('join_user', user.id || user._id);

      newSocket.on('task_due', (data) => {
        console.log('⏰ Task Due:', data);
        
        // Custom Observer Notification
        toast.info(data.message, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: "🧠",
          onClick: () => {
            if (data.link) window.open(data.link, '_blank');
          }
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
