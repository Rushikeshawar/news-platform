 
// src/components/profile/FavoritesList.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userService } from '../../services/userService';
import { 
  Heart, 
  Trash2, 
  Download,
  Eye,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';

const FavoritesList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: '',
    sortBy: 'savedAt',
    order: 'desc'
  });

  const queryClient = useQueryClient();

  const { data: favoritesData, isLoading } = useQuery(
    ['favorites', filters],
    () => userService.getFavorites(filters),
    { keepPreviousData: true }
  );

  const removeFavoriteMutation = useMutation(
    (articleId) => userService.removeFromFavorites(articleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('favorites');
        queryClient.invalidateQueries('favorites-stats');
      }
    }
  );

  const clearAllMutation = useMutation(
    () => userService.clearAllFavorites(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('favorites');
        queryClient.invalidateQueries('favorites-stats');
      }
    }
  );

  const handleRemoveFavorite = (articleId) => {
    if (window.confirm('Remove this article from favorites?')) {
      removeFavoriteMutation.mutate(articleId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all favorites? This cannot be undone.')) {
      clearAllMutation.mutate();
    }
  };

  const handleExport = async (format) => {
    try {
      const data = await userService.exportFavorites(format);
      // Handle download logic here
      console.log('Export data:', data);
    } catch (error) {
      alert('Failed to export favorites');
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading favorites..." />;
  }

  const favorites = favoritesData?.data?.favorites || [];
  const pagination = favoritesData?.data?.pagination || {};

  return (
    <div className="favorites-list">
      <div className="favorites-header">
        <h2>
          <Heart size={24} />
          My Favorites
        </h2>
        <div className="header-actions">
          <button 
            onClick={() => handleExport('json')}
            className="export-btn"
          >
            <Download size={16} />
            Export
          </button>
          {favorites.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="clear-btn"
              disabled={clearAllMutation.isLoading}
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="favorites-controls">
        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            setFilters(prev => ({ ...prev, sortBy, order, page: 1 }));
          }}
          className="sort-select"
        >
          <option value="savedAt-desc">Recently Saved</option>
          <option value="publishedAt-desc">Recently Published</option>
          <option value="viewCount-desc">Most Popular</option>
        </select>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <>
          <div className="favorites-grid">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card">
                <div className="favorite-content">
                  <h3 className="favorite-title">{favorite.article?.title}</h3>
                  <p className="favorite-category">{favorite.article?.category}</p>
                  
                  <div className="favorite-meta">
                    <span className="view-count">
                      <Eye size={12} />
                      {favorite.article?.viewCount || 0}
                    </span>
                    <span className="saved-date">
                      <Calendar size={12} />
                      {new Date(favorite.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveFavorite(favorite.article?.id)}
                  className="remove-favorite"
                  disabled={removeFavoriteMutation.isLoading}
                  title="Remove from favorites"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              showInfo={true}
              totalItems={pagination.totalCount}
            />
          )}
        </>
      ) : (
        <div className="no-favorites">
          <Heart size={48} />
          <h3>No favorites yet</h3>
          <p>Save articles you love to find them easily later</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;