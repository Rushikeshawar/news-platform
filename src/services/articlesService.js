import api from './api';

export const articlesService = {
  // Get all articles
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  // Get article by ID with optional view tracking
  getArticleById: async (id, options = {}) => {
    const params = options.trackView ? { trackView: true } : {};
    const response = await api.get(`/articles/${id}`, { params });
    return response.data;
  },

  // Share article
  shareArticle: async (id) => {
    const response = await api.post(`/articles/${id}/share`);
    return response.data;
  },

  // Get trending articles
  getTrendingArticles: async (params = {}) => {
    const response = await api.get('/articles/trending/list', { params });
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Search articles
  searchArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  }
};