// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import logger from '../utils/logger';

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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token && refreshToken) {
        try {
          // Validate token by fetching current user
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear auth
            clearAuth();
          }
        } catch (error) {
          logger.error('Auth initialization failed:', error);
          clearAuth();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Login with email and password
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setUser(user);
        setIsAuthenticated(true);
        
        logger.info('Login successful');
        return { success: true, user };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      logger.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Two-step registration with OTP
  const requestRegistrationOTP = async (userData) => {
    try {
      const response = await authService.requestOTP(userData);
      return { 
        success: response.success, 
        message: response.message,
        email: userData.email 
      };
    } catch (error) {
      logger.error('Request OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      return { success: false, error: errorMessage };
    }
  };

  const verifyOTPAndRegister = async (email, otp, role = 'USER') => {
    setLoading(true);
    try {
      const response = await authService.verifyOTPAndRegister(email, otp, role);
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setUser(user);
        setIsAuthenticated(true);
        
        logger.info('Registration successful');
        return { success: true, user };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      logger.error('Verify OTP error:', error);
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await authService.resendOTP(email);
      return { success: response.success, message: response.message };
    } catch (error) {
      logger.error('Resend OTP error:', error);
      return { success: false, error: 'Failed to resend OTP' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await authService.logout(refreshToken);
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      // Call user service to update profile
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      logger.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    requestRegistrationOTP,
    verifyOTPAndRegister,
    resendOTP,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};