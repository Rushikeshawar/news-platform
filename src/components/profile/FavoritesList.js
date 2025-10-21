import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Download, Search, Filter } from 'lucide-react';
import { userService } from '../../services/userService';
import ArticleCard from '../articles/ArticleCard';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/components/FavoritesList.css';

const FavoritesList = ({ favoritesData, onRefetch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUnfavoriting, setIsUnfavoriting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const articles = favoritesData?.articles || [];

  // Filter favorites based on search and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.headline?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to remove all favorites? This action cannot be undone.')) {
      return;
    }
    setIsClearing(true);
    try {
      await userService.clearAllFavorites();
      if (onRefetch) onRefetch();
      alert('All favorites cleared successfully');
    } catch (error) {
      console.error('Error clearing favorites:', error);
      alert('Failed to clear favorites. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleExport = async (format = 'json') => {
    setIsExporting(true);
    try {
      const response = await userService.exportFavorites(format);
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `favorites-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting favorites:', error);
      alert('Failed to export favorites. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleUnfavorite = async (articleId) => {
    setIsUnfavoriting(true);
    try {
      await userService.removeFromFavorites(articleId);
      if (onRefetch) onRefetch();
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite. Please try again.');
    } finally {
      setIsUnfavoriting(false);
    }
  };

  // Get unique categories
  const categories = [
    'all',
    ...new Set(articles.map((article) => article.category || 'Uncategorized')),
  ];

  return (
    <div className="favorites-list">
      <div className="favorites-header">
        <div className="header-info">
          <h2 className="favorites-title">
            <Heart size={24} fill="currentColor" />
            My Favorites
          </h2>
          <p className="favorites-count">
            {articles.length} article{articles.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting || articles.length === 0}
            className="export-btn"
            title="Export favorites"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
          <button
            onClick={handleClearAll}
            disabled={isClearing || articles.length === 0}
            className="clear-btn"
            title="Clear all favorites"
          >
            <Trash2 size={18} />
            <span>Clear All</span>
          </button>
        </div>
      </div>
      {articles.length > 0 && (
        <div className="favorites-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filter">
            <Filter size={18} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {articles.length === 0 ? (
        <div className="empty-favorites">
          <Heart size={64} strokeWidth={1} />
          <h3>No favorites yet</h3>
          <p>Start adding articles to your favorites to see them here</p>
          <Link to="/articles" className="browse-btn">
            Browse Articles
          </Link>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="empty-favorites">
          <Search size={64} strokeWidth={1} />
          <h3>No results found</h3>
          <p>Try adjusting your search or filter</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
            }}
            className="reset-btn"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredArticles.map((article) => (
            <div key={article.id} className="favorite-item">
              <ArticleCard
                article={article}
                onFavoriteChange={(articleId, isFavorite) => {
                  if (!isFavorite) {
                    handleUnfavorite(articleId);
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;