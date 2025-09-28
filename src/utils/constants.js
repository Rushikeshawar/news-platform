 
// src/utils/constants.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  ARTICLES: {
    GET_ALL: '/articles',
    GET_BY_ID: '/articles/:id',
    TRENDING: '/articles/trending/list',
    SHARE: '/articles/:id/share'
  },
  AI_ML: {
    NEWS: '/ai-ml/news',
    TRENDING: '/ai-ml/trending',
    SEARCH: '/ai-ml/search',
    CATEGORIES: '/ai-ml/categories'
  },
  TIME_SAVER: {
    CONTENT: '/time-saver/content',
    STATS: '/time-saver/stats',
    CATEGORY: '/time-saver/category/:group'
  },
  USER: {
    PROFILE: '/users/profile',
    DASHBOARD: '/users/dashboard',
    READING_HISTORY: '/users/reading-history',
    FAVORITES: '/favorites'
  }
};

export const CONTENT_TYPES = {
  ARTICLE: 'article',
  AI_ML: 'ai-ml',
  TIME_SAVER: 'time-saver'
};

export const USER_ROLES = {
  USER: 'USER',
  EDITOR: 'EDITOR',
  AD_MANAGER: 'AD_MANAGER',
  ADMIN: 'ADMIN'
};

export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

