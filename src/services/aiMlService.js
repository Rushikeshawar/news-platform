
// ============================================
// FILE 2: src/services/aiMlService.js (UPDATED)
// ============================================
import api from './api';

export const aiMlService = {
  // Get AI/ML news articles
  getAiMlNews: async (params = {}) => {
    const response = await api.get('/ai-ml/news', { params });
    return response.data;
  },

  // Get AI/ML article by ID
  getAiMlArticleById: async (id, trackView = true) => {
    const response = await api.get(`/ai-ml/news/${id}`, { 
      params: { trackView } 
    });
    return response.data;
  },

  // Get trending AI/ML news
  getTrendingAiMl: async (params = {}) => {
    const response = await api.get('/ai-ml/trending', { params });
    return response.data;
  },

  // Search AI/ML content
  searchAiMlContent: async (params = {}) => {
    const response = await api.get('/ai-ml/search', { params });
    return response.data;
  },

  // Get AI/ML categories
  getAiMlCategories: async () => {
    const response = await api.get('/ai-ml/categories');
    return response.data;
  },

  // Get articles by AI/ML category
  getArticlesByCategory: async (category, params = {}) => {
    const response = await api.get(`/ai-ml/category/${category}`, { params });
    return response.data;
  },

  // Get popular AI topics
  getPopularTopics: async (params = {}) => {
    const response = await api.get('/ai-ml/topics/popular', { params });
    return response.data;
  },

  // Track AI article view
  trackAiArticleView: async (id, timestamp = new Date()) => {
    try {
      const response = await api.post(`/ai-ml/news/${id}/view`, { timestamp });
      return response.data;
    } catch (error) {
      console.error('Error tracking view:', error);
      return null;
    }
  },

  // Track AI article interaction
  trackAiArticleInteraction: async (id, interactionType, timestamp = new Date()) => {
    try {
      const response = await api.post(`/ai-ml/news/${id}/interaction`, {
        interactionType,
        timestamp
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return null;
    }
  },

  // Get TimeSaver content linked to AI article (NEW)
  getAiArticleTimeSavers: async (id) => {
    try {
      const response = await api.get(`/ai-ml/news/${id}/timesavers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching timesavers:', error);
      return { data: { timeSavers: [] } };
    }
  },

  // Get AI insights and analytics
  getAiInsights: async (params = {}) => {
    const response = await api.get('/ai-ml/insights', { params });
    return response.data;
  }
};