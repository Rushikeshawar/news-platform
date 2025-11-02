// src/pages/TimeSaverDetailPage.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/TimeSaverDetailPage.css';

const TimeSaverDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [fetchingArticle, setFetchingArticle] = useState(false);

  useEffect(() => {
    fetchContentDetail();
    trackView();
  }, [id]);

  useEffect(() => {
    if (content?.category) {
      fetchRelatedContent();
    }
  }, [content]);

  const fetchContentDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/time-saver/content/${id}`);
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setContent(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.response?.data?.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await axios.post(`/api/time-saver/content/${id}/view`);
    } catch (err) {
      console.error('Failed to track view:', err);
    }
  };

  const fetchRelatedContent = async () => {
    try {
      const response = await axios.get(`/api/time-saver/content`, {
        params: { 
          category: content?.category, 
          limit: 5
        },
      });
      
      if (response.data.success) {
        const allContent = response.data.data || [];
        const filtered = allContent.filter(item => item.id !== id);
        setRelatedContent(filtered.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load related content:', err);
    }
  };

  const handleInteraction = async (type) => {
    try {
      await axios.post(`/api/time-saver/content/${id}/interaction`, {
        interactionType: type
      });
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  const handleSourceClick = () => {
    handleInteraction('click');
    if (content?.sourceUrl) {
      window.open(content.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // ✅ FIXED: Handle article click with proper AI article navigation
  const handleArticleClick = async (articleId, type) => {
    handleInteraction('click');
    
    if (type === 'ai') {
      // ✅ For AI articles, fetch the article first then navigate with state
      setFetchingArticle(true);
      try {
        const response = await axios.get(`/api/ai-ml/news/${articleId}`);
        if (response.data.success && response.data.data.article) {
          // Navigate to AI article detail page with the article data
          navigate(`/ai-ml/${articleId}`, { 
            state: { article: response.data.data.article }
          });
        } else {
          console.error('AI article not found');
          alert('AI article not found');
        }
      } catch (err) {
        console.error('Error fetching AI article:', err);
        alert('Failed to load AI article');
      } finally {
        setFetchingArticle(false);
      }
    } else {
      // Regular articles work normally
      navigate(`/articles/${articleId}`);
    }
  };

  const handleShare = async () => {
    handleInteraction('share');
    if (navigator.share) {
      try {
        await navigator.share({
          title: content?.title,
          text: content?.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      TECHNOLOGY: 'card-category-technology',
      BUSINESS: 'card-category-business',
      POLITICS: 'card-category-politics',
      HEALTH: 'card-category-health',
      SCIENCE: 'card-category-science',
      ENTERTAINMENT: 'card-category-entertainment',
      SPORTS: 'card-category-sports',
      ENVIRONMENT: 'card-category-health',
      OTHER: 'card-category-other',
    };
    return colors[category] || colors.OTHER;
  };

  const formatReadTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.ceil(seconds / 60)}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-spinner"></div>
        <p className="page-loading-text">Loading content...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="page-error">
        <div className="page-error-content">
          <div className="page-error-icon">⚠️</div>
          <p className="page-error-text">{error || 'Content not found'}</p>
          <button onClick={() => navigate('/time-saver')} className="page-error-button">
            Back to TimeSaver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="timesaver-page">
      {/* Loading overlay when fetching AI article */}
      {fetchingArticle && (
        <div className="page-loading" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="page-spinner"></div>
          <p className="page-loading-text">Loading AI article...</p>
        </div>
      )}

      {/* Header Navigation */}
      <header className="detail-page-header">
        <div className="detail-header-wrapper">
          <button
            onClick={() => navigate('/time-saver')}
            className="detail-back-button"
          >
            <span className="back-arrow">←</span>
            <span className="back-text">Back to TimeSaver</span>
          </button>
        </div>
      </header>

      {/* Main Layout with Sidebar and Content */}
      <div className="timesaver-layout">
        {/* Sidebar */}
        <aside className="timesaver-sidebar">
          <h3 className="sidebar-title">Related Content</h3>
          <div className="filter-section">
            <div className="filter-section-title">More in {content.category}</div>
            <div className="filter-options">
              {relatedContent.length > 0 ? (
                relatedContent.map(item => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/time-saver/${item.id}`)}
                    className="filter-option"
                  >
                    <span className="line-clamp-2">{item.title}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No related content found</p>
              )}
            </div>
          </div>
          {content.tags && (
            <div className="filter-section">
              <div className="filter-section-title">Tags</div>
              <div className="content-tags">
                {content.tags.split(',').map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="timesaver-main">
          <article className="content-card">
            {/* Featured Image */}
            {content.imageUrl && (
              <div className="card-image-container">
                <img src={content.imageUrl} alt={content.title} className="card-image" />
              </div>
            )}

            {/* Content Header */}
            <div className="card-content">
              {/* Priority Badge */}
              {content.isPriority && (
                <span className="card-priority-badge">🔥 Priority Content</span>
              )}

              {/* Category and Meta */}
              <div className="card-meta">
                <span className={`card-category ${getCategoryColor(content.category)}`}>
                  {content.category}
                </span>
                <span className="card-read-time">⏱️ {formatReadTime(content.readTimeSeconds)}</span>
                <span className="stat-item">👁️ {content.viewCount || 0} views</span>
                <span className="stat-item">📅 {formatDate(content.publishedAt)}</span>
              </div>

              {/* Title */}
              <h1 className="card-title">{content.title}</h1>

              {/* Summary */}
              <p className="card-summary">{content.summary}</p>

              {/* Key Points */}
              {content.keyPoints && (
                <div className="key-points">
                  <h3 className="key-points-title">📌 Key Points</h3>
                  <ul className="key-points-list">
                    {(typeof content.keyPoints === 'string' 
                      ? content.keyPoints.split('|').filter(p => p.trim()) 
                      : content.keyPoints
                    ).map((point, index) => (
                      <li key={index}>{point.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="card-actions">
                {content.sourceUrl && (
                  <button onClick={handleSourceClick} className="share-btn">
                    <span className="btn-icon">🔗</span>
                    View Original Source
                  </button>
                )}
                <button onClick={handleShare} className="share-btn">
                  <span className="btn-icon">📤</span>
                  Share
                </button>
              </div>

              {/* Linked Articles Section */}
              {(content.linkedArticle || content.linkedAiArticle) && (
                <div className="linked-articles-section">
                  <h3 className="section-title">
                    📰 Related Full Articles
                  </h3>

                  {/* Regular Article */}
                  {content.linkedArticle && (
                    <div className="content-card linked-article-card">
                      <div className="card-content">
                        <div className="card-meta">
                          <span className="card-category category-news">NEWS ARTICLE</span>
                          <span className="card-read-time">
                            {formatDate(content.linkedArticle.publishedAt)}
                          </span>
                        </div>
                        <h4 className="card-title">{content.linkedArticle.headline}</h4>
                        {content.linkedArticle.briefContent && (
                          <p className="card-summary">{content.linkedArticle.briefContent}</p>
                        )}
                        {content.linkedArticle.author && (
                          <div className="author-info">
                            {content.linkedArticle.author.avatar && (
                              <img
                                src={content.linkedArticle.author.avatar}
                                alt={content.linkedArticle.author.fullName}
                                className="author-avatar"
                              />
                            )}
                            <span className="author-name">
                              By {content.linkedArticle.author.fullName}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => handleArticleClick(content.linkedArticle.id, 'news')}
                          className="share-btn"
                          disabled={fetchingArticle}
                        >
                          Read Full Article →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AI Article */}
                  {content.linkedAiArticle && (
                    <div className="content-card linked-article-card">
                      <div className="card-content">
                        <div className="card-meta">
                          <span className="card-category category-ai">🤖 AI ARTICLE</span>
                          <span className="card-read-time">
                            {formatDate(content.linkedAiArticle.publishedAt)}
                          </span>
                        </div>
                        <h4 className="card-title">{content.linkedAiArticle.headline}</h4>
                        {content.linkedAiArticle.briefContent && (
                          <p className="card-summary">{content.linkedAiArticle.briefContent}</p>
                        )}
                        <div className="content-tags">
                          {content.linkedAiArticle.aiModel && (
                            <span className="tag">{content.linkedAiArticle.aiModel}</span>
                          )}
                          {content.linkedAiArticle.aiApplication && (
                            <span className="tag">{content.linkedAiArticle.aiApplication}</span>
                          )}
                          {content.linkedAiArticle.companyMentioned && (
                            <span className="tag">{content.linkedAiArticle.companyMentioned}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleArticleClick(content.linkedAiArticle.id, 'ai')}
                          className="share-btn"
                          disabled={fetchingArticle}
                        >
                          {fetchingArticle ? 'Loading...' : 'Read Full AI Article →'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Creator Info */}
              {content.creator && (
                <div className="creator-section">
                  <p className="creator-text">
                    Content curated by:{' '}
                    <span className="creator-name">{content.creator.fullName}</span>
                  </p>
                </div>
              )}
            </div>
          </article>

          {/* About Section */}
          <div className="about-section">
            <h3 className="about-title">About TimeSaver</h3>
            <p className="about-text">
              TimeSaver provides quick, digestible summaries of important news and articles. Each piece
              is carefully curated to save you time while keeping you informed. Click on linked articles
              to dive deeper into topics that interest you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSaverDetailPage;