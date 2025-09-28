 
import api from './api';

export const userService = {
  // Get user profile
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Get reading history
  getReadingHistory: async (params = {}) => {
    const response = await api.get('/users/reading-history', { params });
    return response.data;
  },

  // Update reading progress
  updateReadingProgress: async (articleId, progressData) => {
    const response = await api.put(`/users/reading-progress/${articleId}`, progressData);
    return response.data;
  },

  // Get user dashboard stats
  getUserDashboard: async (params = {}) => {
    const response = await api.get('/users/dashboard', { params });
    return response.data;
  },

  // Get favorites
  getFavorites: async (params = {}) => {
    const response = await api.get('/favorites', { params });
    return response.data;
  },

  // Add to favorites
  addToFavorites: async (articleId) => {
    const response = await api.post(`/favorites/${articleId}`);
    return response.data;
  },

  // Remove from favorites
  removeFromFavorites: async (articleId) => {
    const response = await api.delete(`/favorites/${articleId}`);
    return response.data;
  },

  // Check favorite status
  checkFavoriteStatus: async (articleId) => {
    const response = await api.get(`/favorites/${articleId}/status`);
    return response.data;
  },

  // Get favorites statistics
  getFavoritesStats: async () => {
    const response = await api.get('/favorites/stats');
    return response.data;
  },

  // Export favorites
  exportFavorites: async (format = 'json') => {
    const response = await api.get('/favorites/export', { 
      params: { format } 
    });
    return response.data;
  },

  // Bulk favorites operation
  bulkFavoritesOperation: async (articleIds, action) => {
    const response = await api.post('/favorites/bulk', {
      articleIds,
      action
    });
    return response.data;
  },

  // Clear all favorites
  clearAllFavorites: async () => {
    const response = await api.delete('/favorites', {
      data: { confirm: true }
    });
    return response.data;
  },

  // Get notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Get unread notifications count
  getUnreadNotificationsCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }
};