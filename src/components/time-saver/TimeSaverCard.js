// src/components/time-saver/TimeSaverCard.js
import React from 'react';
import { 
  Clock, 
  Eye, 
  Share2, 
  ExternalLink,
  Zap,
  Calendar,
  AlertCircle
} from 'lucide-react';
import '../../styles/components/TimeSaverCard.css';

const TimeSaverCard = ({ content }) => {
  const formatReadTime = (seconds) => {
    if (!seconds) return 'Quick read';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.ceil(seconds / 60);
    return `${minutes}m read`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || '0';
  };

  const getKeyPoints = () => {
    if (!content.keyPoints) return [];
    if (typeof content.keyPoints === 'string') {
      return content.keyPoints.split('|').filter(point => point.trim());
    }
    return Array.isArray(content.keyPoints) ? content.keyPoints : [];
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: content.title,
          text: content.summary,
          url: content.sourceUrl || window.location.href
        });
      } else {
        await navigator.clipboard.writeText(content.sourceUrl || window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleClick = () => {
    if (content.sourceUrl) {
      window.open(content.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const keyPoints = getKeyPoints();
  const cardStyle = content.bgColor ? { backgroundColor: content.bgColor } : {};

  return (
    <article 
      className={`timesaver-card ${content.isPriority ? 'priority' : ''} ${content.contentType?.toLowerCase() || ''}`}
      style={cardStyle}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="card-header">
        <div className="card-meta">
          <span className="content-type">{content.contentType || 'DIGEST'}</span>
          {content.isPriority && (
            <span className="priority-badge">
              <AlertCircle size={12} />
              Priority
            </span>
          )}
          <span className="category">{content.category}</span>
        </div>
        <div className="card-actions">
          <button 
            className="share-btn"
            onClick={handleShare}
            title="Share content"
          >
            <Share2 size={14} />
          </button>
          {content.sourceUrl && (
            <ExternalLink size={14} className="external-link" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="card-content">
        {/* Icon */}
        {content.iconName && (
          <div className="content-icon">
            {content.iconName === 'zap' && <Zap size={20} />}
            {content.iconName === 'clock' && <Clock size={20} />}
            {content.iconName === 'calendar' && <Calendar size={20} />}
            {content.iconName === 'alert' && <AlertCircle size={20} />}
          </div>
        )}

        {/* Image */}
        {content.imageUrl && (
          <div className="content-image">
            <img 
              src={content.imageUrl} 
              alt={content.title}
              loading="lazy"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="content-title">{content.title}</h3>

        {/* Summary */}
        <p className="content-summary">{content.summary}</p>

        {/* Key Points */}
        {keyPoints.length > 0 && (
          <div className="key-points">
            <h4 className="key-points-title">Key Points:</h4>
            <ul className="key-points-list">
              {keyPoints.slice(0, 3).map((point, index) => (
                <li key={index} className="key-point">
                  {point.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {content.tags && (
          <div className="content-tags">
            {content.tags.split(',').slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="footer-stats">
          <div className="stat-item">
            <Clock size={12} />
            <span>{formatReadTime(content.readTimeSeconds)}</span>
          </div>
          <div className="stat-item">
            <Eye size={12} />
            <span>{formatViewCount(content.viewCount)}</span>
          </div>
          <div className="stat-item">
            <Calendar size={12} />
            <span>{formatDate(content.publishedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TimeSaverCard;