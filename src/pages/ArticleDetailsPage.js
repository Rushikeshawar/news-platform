import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { articlesService } from '../services/articlesService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Calendar, Eye, Share2, User, Clock, ArrowLeft, Heart, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/ArticleDetailsPage.css';

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { data: articleData, isLoading, error } = useQuery(
    ['article', id],
    () => articlesService.getArticleById(id, { trackView: true }),
    { 
      enabled: !!id,
      staleTime: 2 * 60 * 1000
    }
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViewCount = (count) => {
    if (!count) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  const handleShare = async () => {
    try {
      await articlesService.shareArticle(id);
      if (navigator.share) {
        await navigator.share({
          title: article.headline || article.title,
          text: article.briefContent || article.summary,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      navigate('/login');
      return;
    }
    console.log('Toggle favorite for article:', id);
  };

  if (isLoading) {
    return (
      <div className="article-details-page">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-details-page">
        <div className="container">
          <ErrorMessage message="Failed to load article" />
          <button 
            onClick={() => navigate('/articles')} 
            className="back-button"
            style={{ marginTop: '20px' }}
          >
            <ArrowLeft size={20} />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const article = articleData?.data?.article;
  
  if (!article) {
    return (
      <div className="article-details-page">
        <div className="container">
          <ErrorMessage message="Article not found" />
          <button 
            onClick={() => navigate('/articles')} 
            className="back-button"
            style={{ marginTop: '20px' }}
          >
            <ArrowLeft size={20} />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  // Parse tags if it's a string
  const parseTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    return [];
  };

  const tags = parseTags(article.tags);

  return (
    <div className="article-details-page">
      <div className="container">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/articles')} 
          className="back-button"
        >
          <ArrowLeft size={20} />
          Back to Articles
        </button>

        <article className="article-full">
          {/* Article Header */}
          <header className="article-header">
            <div className="header-badges">
              {/* Category Badge */}
              {article.category && (
                <Link 
                  to={`/articles?category=${article.category}`}
                  className="category-badge"
                >
                  <Tag size={14} />
                  {article.category}
                </Link>
              )}

              {/* Featured Badge */}
              {(article.featured || article.priorityLevel >= 8) && (
                <span className="featured-indicator">Featured Article</span>
              )}
            </div>

            {/* Title */}
            <h1 className="article-title">
              {article.headline || article.title}
            </h1>

            {/* Summary/Excerpt */}
            {(article.briefContent || article.summary || article.excerpt) && (
              <p className="article-lead">
                {article.briefContent || article.summary || article.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="article-meta">
              {article.author && (
                <div className="meta-item author">
                  <User size={16} />
                  <span>{article.author.fullName || article.author.name || 'Unknown Author'}</span>
                </div>
              )}
              {article.publishedAt && (
                <div className="meta-item date">
                  <Calendar size={16} />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              )}
              {article.readTime && (
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{article.readTime} min read</span>
                </div>
              )}
              <div className="meta-item">
                <Eye size={16} />
                <span>{formatViewCount(article.viewCount || 0)} views</span>
              </div>
              {article.shareCount > 0 && (
                <div className="meta-item">
                  <Share2 size={16} />
                  <span>{formatViewCount(article.shareCount)} shares</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="article-actions">
              <button 
                className="action-btn share-btn"
                onClick={handleShare}
                title="Share article"
              >
                <Share2 size={18} />
                Share
              </button>
              <button 
                className="action-btn favorite-btn"
                onClick={handleFavorite}
                title="Add to favorites"
              >
                <Heart size={18} />
                Favorite
              </button>
            </div>
          </header>

          {/* Featured Image */}
          {(article.featuredImage || article.imageUrl) && (
            <div className="article-image-container">
              <img 
                src={article.featuredImage || article.imageUrl} 
                alt={article.headline || article.title}
                className="article-featured-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="article-content">
            <div className="article-body">
              {/* Display full content */}
              {(article.fullContent || article.content) && (
                <div className="content-text">
                  {/* Check if it's HTML or plain text */}
                  {(article.fullContent || article.content).includes('<') ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: article.fullContent || article.content 
                    }} />
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {article.fullContent || article.content}
                    </div>
                  )}
                </div>
              )}
              
              {/* If no full content, show brief content */}
              {!(article.fullContent || article.content) && (article.briefContent || article.summary || article.excerpt) && (
                <div className="content-text">
                  <p>{article.briefContent || article.summary || article.excerpt}</p>
                </div>
              )}
              
              {/* If no content at all */}
              {!(article.fullContent || article.content) && 
               !(article.briefContent || article.summary || article.excerpt) && (
                <div className="no-content-message">
                  <p>No content available for this article.</p>
                </div>
              )}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="article-footer">
            {/* Tags Section */}
            {tags.length > 0 && (
              <div className="article-tags">
                <h4>Tags:</h4>
                <div className="tags-container">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="article-info">
              {article.publishedAt && (
                <div className="info-item">
                  <strong>Published:</strong> {formatDate(article.publishedAt)}
                </div>
              )}
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <div className="info-item">
                  <strong>Last Updated:</strong> {formatDate(article.updatedAt)}
                </div>
              )}
              {article.status && (
                <div className="info-item">
                  <strong>Status:</strong> {article.status}
                </div>
              )}
              {article.priorityLevel !== undefined && (
                <div className="info-item">
                  <strong>Priority:</strong> {article.priorityLevel}
                </div>
              )}
            </div>

            {/* Time Saver References */}
            {article.timeSaverReferences && article.timeSaverReferences.length > 0 && (
              <div className="time-saver-section">
                <h4>Related Quick Reads:</h4>
                <div className="time-saver-list">
                  {article.timeSaverReferences.map((ts) => (
                    <Link 
                      key={ts.id} 
                      to={`/time-saver/${ts.id}`}
                      className="time-saver-item"
                    >
                      <div className="ts-icon" style={{ background: ts.bgColor }}>
                        {ts.iconName}
                      </div>
                      <div className="ts-content">
                        <h5>{ts.title}</h5>
                        <p>{ts.summary}</p>
                        <span className="ts-meta">{ts.readTimeSeconds}s read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Approver Info */}
            {article.approver && (
              <div className="approver-info">
                <small>
                  Approved by: {article.approver.fullName}
                </small>
              </div>
            )}
          </footer>
        </article>

        {/* Related Articles Section */}
        {article.category && (
          <div className="related-section">
            <h3>More in {article.category}</h3>
            <Link 
              to={`/articles?category=${article.category}`}
              className="view-more-btn"
            >
              View all {article.category} articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailsPage;