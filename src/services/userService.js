import api from './api';

export const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data.data.user; // Backend returns { success: true, data: { user } }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  },

  // Get reading history
  getReadingHistory: async (params = {}) => {
    try {
      const response = await api.get('/users/reading-history', { params });
      return response.data.data; // Backend returns { success: true, data: { readingHistory, pagination } }
    } catch (error) {
      console.error('Error fetching reading history:', error);
      throw new Error('Failed to fetch reading history');
    }
  },

  // Update reading progress
  updateReadingProgress: async (articleId, progressData) => {
    try {
      const response = await api.put(`/users/reading-progress/${articleId}`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating reading progress:', error);
      throw new Error('Failed to update reading progress');
    }
  },

  // Get user dashboard stats
  getUserDashboard: async (params = {}) => {
    try {
      const response = await api.get('/users/dashboard', { params });
      return response.data.data.dashboard; // Backend returns { success: true, data: { dashboard } }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  },

  // Get favorites
  getFavorites: async (params = {}) => {
    try {
      const response = await api.get('/favorites', { params });
      return response.data.data; // Backend returns { success: true, data: { articles, pagination } }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw new Error('Failed to fetch favorites');
    }
  },

  // Add to favorites
  addToFavorites: async (articleId) => {
    try {
      const response = await api.post(`/favorites/${articleId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Failed to add to favorites');
    }
  },

  // Remove from favorites
  removeFromFavorites: async (articleId) => {
    try {
      const response = await api.delete(`/favorites/${articleId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Failed to remove from favorites');
    }
  },

  // Check favorite status
  checkFavoriteStatus: async (articleId) => {
    try {
      const response = await api.get(`/favorites/${articleId}/status`);
      return response.data.data; // Backend returns { success: true, data: { isFavorite, savedAt } }
    } catch (error) {
      console.error('Error checking favorite status:', error);
      throw new Error('Failed to check favorite status');
    }
  },

  // Get favorites statistics
  getFavoritesStats: async () => {
    try {
      const response = await api.get('/favorites/stats');
      return response.data.data.stats; // Backend returns { success: true, data: { stats } }
    } catch (error) {
      console.error('Error fetching favorites stats:', error);
      throw new Error('Failed to fetch favorites stats');
    }
  },

  // Export favorites
  exportFavorites: async (format = 'json') => {
    try {
      const response = await api.get('/favorites/export', { params: { format } });
      return response.data;
    } catch (error) {
      console.error('Error exporting favorites:', error);
      throw new Error('Failed to export favorites');
    }
  },

  // Bulk favorites operation
  bulkFavoritesOperation: async (articleIds, action) => {
    try {
      const response = await api.post('/favorites/bulk', { articleIds, action });
      return response.data;
    } catch (error) {
      console.error('Error performing bulk favorites operation:', error);
      throw new Error('Failed to perform bulk favorites operation');
    }
  },

  // Clear all favorites
  clearAllFavorites: async () => {
    try {
      const response = await api.delete('/favorites', { data: { confirm: true } });
      return response.data;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw new Error('Failed to clear favorites');
    }
  },

  // Get notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params });
      return response.data.data; // Backend returns { success: true, data: { notifications, unreadCount, pagination } }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  },

  // Get unread notifications count
  getUnreadNotificationsCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.data.unreadCount; // Backend returns { success: true, data: { unreadCount } }
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
      throw new Error('Failed to fetch unread notifications count');
    }
  },
};