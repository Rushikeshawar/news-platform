 
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Eye, 
  Share2, 
  Heart, 
  Clock, 
  User, 
  Calendar,
  Star
} from 'lucide-react';
import '../../styles/components/ArticleCard.css';

const ArticleCard = ({ article, viewMode = 'grid' }) => {
  const { isAuthenticated } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary || article.excerpt,
          url: window.location.origin + `/articles/${article.id}`
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          window.location.origin + `/articles/${article.id}`
        );
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }
    
    // Implement favorite functionality
    console.log('Toggle favorite for article:', article.id);
  };

  return (
    <article className={`article-card ${viewMode}`}>
      <Link to={`/articles/${article.id}`} className="article-link">
        {/* Article Image */}
        {article.imageUrl && (
          <div className="article-image">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              loading="lazy"
            />
            {article.featured && (
              <div className="featured-badge">
                <Star size={14} />
                Featured
              </div>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="article-content">
          {/* Category & Date */}
          <div className="article-meta">
            <span className="article-category">{article.category}</span>
            <span className="article-date">
              <Calendar size={12} />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="article-title">{article.title}</h3>

          {/* Summary/Excerpt */}
          {(article.summary || article.excerpt) && (
            <p className="article-summary">
              {article.summary || article.excerpt}
            </p>
          )}

          {/* Author Info */}
          {article.author && (
            <div className="article-author">
              <User size={14} />
              <span>{article.author.fullName || article.author.name}</span>
            </div>
          )}

          {/* Article Stats */}
          <div className="article-stats">
            <div className="stat-item">
              <Eye size={14} />
              <span>{formatViewCount(article.viewCount || 0)}</span>
            </div>
            
            {article.shareCount && (
              <div className="stat-item">
                <Share2 size={14} />
                <span>{formatViewCount(article.shareCount)}</span>
              </div>
            )}

            {article.readTime && (
              <div className="stat-item">
                <Clock size={14} />
                <span>{article.readTime} min read</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="article-actions">
            <button 
              className="action-btn share"
              onClick={handleShare}
              title="Share article"
            >
              <Share2 size={16} />
            </button>
            
            <button 
              className="action-btn favorite"
              onClick={handleFavorite}
              title="Add to favorites"
            >
              <Heart size={16} />
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;