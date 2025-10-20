 
// src/services/authService.js
import api from './api';

export const authService = {
  // ==========================================
  // OTP-BASED REGISTRATION
  // ==========================================
  
  // Step 1: Request OTP for registration
  requestOTP: async (userData) => {
    const response = await api.post('/auth/register/request-otp', {
      email: userData.email,
      fullName: userData.fullName,
      password: userData.password
    });
    return response.data;
  },

  // Step 2: Verify OTP and complete registration
  verifyOTPAndRegister: async (email, otp, role = 'USER') => {
    const response = await api.post('/auth/register/verify-otp', {
      email,
      otp,
      role
    });
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await api.post('/auth/register/resend-otp', { email });
    return response.data;
  },

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },

  // Logout from all devices
  logoutAll: async () => {
    const response = await api.post('/auth/logout-all');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // ==========================================
  // PASSWORD RESET WITH OTP
  // ==========================================
  
  // Request password reset OTP
  requestPasswordResetOTP: async (email) => {
    const response = await api.post('/auth/password/request-reset', { email });
    return response.data;
  },

  // Verify password reset OTP
  verifyPasswordResetOTP: async (email, otp) => {
    const response = await api.post('/auth/password/verify-otp', { email, otp });
    return response.data;
  },

  // Reset password
  resetPassword: async (email, newPassword) => {
    const response = await api.post('/auth/password/reset', { email, newPassword });
    return response.data;
  }
};