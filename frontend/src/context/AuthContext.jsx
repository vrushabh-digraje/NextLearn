import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted session
    try {
      const storedUser = localStorage.getItem('lms_user');
      const storedToken = localStorage.getItem('lms_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.error('Failed to parse persisted user session:', err);
      localStorage.removeItem('lms_user');
      localStorage.removeItem('lms_token');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      setToken(data.token);
      localStorage.setItem('lms_user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role }));
      localStorage.setItem('lms_token', data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      setToken(data.token);
      localStorage.setItem('lms_user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role }));
      localStorage.setItem('lms_token', data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lms_user');
    localStorage.removeItem('lms_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
