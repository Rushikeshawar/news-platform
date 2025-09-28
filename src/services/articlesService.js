 
import api from './api';

export const articlesService = {
  // Get all published articles
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  // Get article by ID
  getArticleById: async (id, trackView = true) => {
    const response = await api.get(`/articles/${id}`, { 
      params: { trackView } 
    });
    return response.data;
  },

  // Search articles
  searchArticles: async (params = {}) => {
    const response = await api.get('/search', { params });
    return response.data;
  },

  // Get trending articles
  getTrendingArticles: async (params = {}) => {
    const response = await api.get('/articles/trending/list', { params });
    return response.data;
  },

  // Share article
  shareArticle: async (id) => {
    const response = await api.post(`/articles/${id}/share`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get articles by category
  getArticlesByCategory: async (category, params = {}) => {
    const response = await api.get(`/categories/${category}/articles`, { params });
    return response.data;
  },

  // Advanced search
  advancedSearch: async (searchData) => {
    const response = await api.post('/search/advanced', searchData);
    return response.data;
  }
};