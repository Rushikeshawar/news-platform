
// ============================================
// FILE 2: src/components/ai-ml/AiMlCard.js (UPDATED)
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Share2, Calendar, Cpu, Building, TrendingUp, Star } from 'lucide-react';
import '../../styles/components/AiMlCard.css';

const AiMlCard = ({ article }) => {
  const formatDate = (dateString) => {
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
      const url = `${window.location.origin}/ai-ml/${article.id}`;
      if (navigator.share) {
        await navigator.share({ title: article.headline, text: article.briefContent, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const formatRelevanceScore = (score) => (typeof score === 'number' ? score.toFixed(1) : null);

  return (
    <article className="aiml-card">
      {/* Changed link to point to detail page */}
      <Link to={`/ai-ml/${article.id}`} className="aiml-link">
        {article.featuredImage && (
          <div className="aiml-image">
            <img src={article.featuredImage} alt={article.headline} loading="lazy" />
            {article.isTrending && (
              <div className="trending-badge">
                <TrendingUp size={14} />
                Trending
              </div>
            )}
          </div>
        )}

        <div className="aiml-content">
          <div className="aiml-meta">
            <span className="aiml-category">{article.category}</span>
            <span className="aiml-date">
              <Calendar size={12} />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h3 className="aiml-title">{article.headline}</h3>

          {article.briefContent && <p className="aiml-brief">{article.briefContent}</p>}

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

            {article.technologyType && <span className="tech-type">{article.technologyType}</span>}
          </div>

          {article.tags && (
            <div className="aiml-tags">
              {article.tags.split(',').slice(0, 3).map((tag, i) => (
                <span key={i} className="tag">{tag.trim()}</span>
              ))}
            </div>
          )}

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

            {formatRelevanceScore(article.relevanceScore) && (
              <div className="stat-item relevance">
                <Star size={14} />
                <span>{formatRelevanceScore(article.relevanceScore)}/10</span>
              </div>
            )}
          </div>

          <div className="aiml-actions">
            <button className="share-btn" onClick={handleShare} title="Share article">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default AiMlCard;

