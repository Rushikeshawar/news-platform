// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Mock login - replace with actual API call
      console.log('Login attempt with:', credentials);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        fullName: 'Demo User',
        email: credentials.email,
        role: 'USER'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('token', 'demo-token');
      
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('Register attempt with:', userData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: '1',
        fullName: userData.fullName,
        email: userData.email,
        role: 'USER'
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('token', 'demo-token');
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({
        id: '1',
        fullName: 'Demo User',
        email: 'demo@example.com',
        role: 'USER'
      });
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

