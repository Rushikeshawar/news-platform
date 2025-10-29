// src/components/common/ArticleCard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Share2, Calendar, User, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import '../../styles/components/ArticleCard.css';

const ArticleCard = ({ article, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && article?.id) {
      checkFavoriteStatus();
    } else {
      setIsLoadingFavorite(false);
      setIsFavorite(false);
    }
  }, [article?.id, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      setIsLoadingFavorite(true);
      const response = await userService.checkFavoriteStatus(article.id);
      
      // Handle different response structures
      const favoriteStatus = response?.isFavorite || response?.data?.isFavorite || false;
      setIsFavorite(favoriteStatus);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      // Don't throw error, just set to false
      setIsFavorite(false);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (isTogglingFavorite) return; // Prevent multiple clicks

    setIsTogglingFavorite(true);
    const previousState = isFavorite;
    
    // Optimistic update
    setIsFavorite(!isFavorite);

    try {
      if (previousState) {
        await userService.removeFromFavorites(article.id);
      } else {
        await userService.addToFavorites(article.id);
      }
      
      // Notify parent component if callback provided
      if (onFavoriteChange) {
        onFavoriteChange(article.id, !previousState);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Revert optimistic update on error
      setIsFavorite(previousState);
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || 'Failed to update favorites. Please try again.';
      alert(errorMessage);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const diff = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diff, 'day');
  };

  const formatViewCount = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/articles/${article.id}`;
      if (navigator.share) {
        await navigator.share({ 
          title: article.headline || article.title, 
          text: article.briefContent || article.summary || article.excerpt, 
          url 
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const title = article.headline || article.title;
  const brief = article.briefContent || article.summary || article.excerpt;
  const image = article.featuredImage || article.imageUrl;
  const category = article.categoryDisplayName || article.category;
  const authorName = article.author?.fullName || article.author?.name;

  return (
    <article className="article-card">
      <Link to={`/articles/${article.id}`} className="article-link">
        {/* Article Image */}
        <div className="article-image">
          {image ? (
            <img src={image} alt={title} loading="lazy" />
          ) : (
            <div className="article-image-placeholder">
              <div className="placeholder-content">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
          )}
          
          {/* Favorite Button Overlay */}
          {isAuthenticated && (
            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''} ${isTogglingFavorite ? 'loading' : ''}`}
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite || isLoadingFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={20} 
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>
          )}
        </div>

        <div className="article-content">
          {/* Category and Date */}
          <div className="article-header">
            <span className="article-category">
              {category || 'Uncategorized'}
            </span>
            <span className="article-date">
              <Calendar size={14} />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="article-title">{title}</h3>

          {/* Brief/Summary */}
          {brief && (
            <p className="article-brief">{brief}</p>
          )}

          {/* Author */}
          {authorName && (
            <div className="article-author">
              <User size={16} />
              <span>{authorName}</span>
            </div>
          )}

          {/* Stats */}
          <div className="article-stats">
            <div className="stat-item">
              <Eye size={16} />
              <span>{formatViewCount(article.viewCount || 0)}</span>
            </div>
            
            {article.shareCount > 0 && (
              <div className="stat-item">
                <Share2 size={16} />
                <span>{formatViewCount(article.shareCount)}</span>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button 
            className="article-share-btn" 
            onClick={handleShare}
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;