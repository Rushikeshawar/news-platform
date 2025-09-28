// src/components/ai-ml/AiMlCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Share2, 
  Clock, 
  Calendar,
  Cpu,
  Building,
  TrendingUp,
  Star
} from 'lucide-react';
import '../../styles/components/AiMlCard.css';

const AiMlCard = ({ article }) => {
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
    return count?.toString() || '0';
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.headline,
          text: article.briefContent,
          url: window.location.origin + `/ai-ml/${article.id}`
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.origin + `/ai-ml/${article.id}`
        );
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Safe relevance score formatting
  const formatRelevanceScore = (score) => {
    if (score === null || score === undefined || typeof score !== 'number') {
      return null;
    }
    return score.toFixed(1);
  };

  return (
    <article className="aiml-card">
      <Link to={`/ai-ml/${article.id}`} className="aiml-link">
        {/* Article Image */}
        {article.featuredImage && (
          <div className="aiml-image">
            <img 
              src={article.featuredImage} 
              alt={article.headline}
              loading="lazy"
            />
            {article.isTrending && (
              <div className="trending-badge">
                <TrendingUp size={14} />
                Trending
              </div>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="aiml-content">
          {/* Category & Date */}
          <div className="aiml-meta">
            <span className="aiml-category">{article.category}</span>
            <span className="aiml-date">
              <Calendar size={12} />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="aiml-title">{article.headline}</h3>

          {/* Brief Content */}
          {article.briefContent && (
            <p className="aiml-brief">{article.briefContent}</p>
          )}

          {/* AI/ML Specific Info */}
          <div className="aiml-info">
            {article.aiModel && (
              <div className="info-item">
                <Cpu size={14} />
                <span className="ai-model">{article.aiModel}</span>
              </div>
            )}

            {article.companyMentioned && (
              <div className="info-item">
                <Building size={14} />
                <span className="company">{article.companyMentioned}</span>
              </div>
            )}

            {article.technologyType && (
              <span className="tech-type">{article.technologyType}</span>
            )}
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="aiml-tags">
              {article.tags.split(',').slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Article Stats */}
          <div className="aiml-stats">
            <div className="stat-item">
              <Eye size={14} />
              <span>{formatViewCount(article.viewCount)}</span>
            </div>
            
            {article.shareCount > 0 && (
              <div className="stat-item">
                <Share2 size={14} />
                <span>{formatViewCount(article.shareCount)}</span>
              </div>
            )}

            {/* Fixed relevance score display */}
            {formatRelevanceScore(article.relevanceScore) && (
              <div className="stat-item relevance">
                <Star size={14} />
                <span>{formatRelevanceScore(article.relevanceScore)}/10</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="aiml-actions">
            <button 
              className="share-btn"
              onClick={handleShare}
              title="Share article"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default AiMlCard;