import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on refresh
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/providers/me'); // Or a generic /auth/me route
          setUser(res.data.user || res.data); 
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserData = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);