// src/services/timeSaverService.js - FIXED VERSION
import api from './api';

export const timeSaverService = {
  // Get time saver content with enhanced filtering
  getContent: async (params = {}) => {
    const response = await api.get('/time-saver/content', { params });
    return response.data;
  },

  // ✅ NEW: Get single time saver content by ID
  getContentById: async (id) => {
    const response = await api.get(`/time-saver/content/${id}`);
    return response.data;
  },

  // Get enhanced quick stats for dashboard
  getStats: async () => {
    const response = await api.get('/time-saver/stats');
    return response.data;
  },

  // Get content by specific category group
  getCategoryContent: async (group, params = {}) => {
    const response = await api.get(`/time-saver/category/${group}`, { params });
    return response.data;
  },

  // Track time saver content view
  trackView: async (id, timestamp = new Date()) => {
    const response = await api.post(`/time-saver/content/${id}/view`, { timestamp });
    return response.data;
  },

  // Track time saver content interaction
  trackInteraction: async (id, interactionType, timestamp = new Date()) => {
    const response = await api.post(`/time-saver/content/${id}/interaction`, {
      interactionType,
      timestamp
    });
    return response.data;
  },

  // Get analytics (requires authentication)
  getAnalytics: async (params = {}) => {
    const response = await api.get('/time-saver/analytics', { params });
    return response.data;
  }
};