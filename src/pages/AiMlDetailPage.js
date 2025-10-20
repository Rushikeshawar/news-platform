// src/pages/AiMlDetailPage.js - FIXED VERSION
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  ArrowLeft, Calendar, Eye, Share2, Bookmark, Clock, 
  Tag, TrendingUp, ExternalLink, Cpu, Brain, ChevronRight,
  Building, Star
} from 'lucide-react';
import { aiMlService } from '../services/aiMlService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import '../styles/pages/AiMlDetailPage.css';

const AiMlDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  // Fetch article data with view tracking enabled
  const { data, isLoading, error, refetch } = useQuery(
    ['aiml-article', id],
    () => aiMlService.getAiMlArticleById(id, true),
    { 
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      retry: 1
    }
  );

  const article = data?.data?.article;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Handle share
  const handleShare = async () => {
    try {
      const articleUrl = `${window.location.origin}/ai-ml/${id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: article.headline,
          text: article.briefContent || article.summary,
          url: articleUrl
        });
      } else {
        await navigator.clipboard.writeText(articleUrl);
        alert('Link copied to clipboard!');
      }
      
      // Track share interaction
      await aiMlService.trackAiArticleInteraction(id, 'SHARE');
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.log('Share cancelled or failed');
    }
  };

  // Handle bookmark
  const handleBookmark = async () => {
    const newBookmarkState = !bookmarked;
    setBookmarked(newBookmarkState);
    
    if (newBookmarkState) {
      await aiMlService.trackAiArticleInteraction(id, 'BOOKMARK');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatViewCount = (count) => {
    if (!count) return '0';
    const num = typeof count === 'string' ? parseInt(count, 10) : count;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatRelevanceScore = (score) => {
    if (!score) return null;
    const num = typeof score === 'string' ? parseFloat(score) : score;
    return !isNaN(num) ? num.toFixed(1) : null;
  };

  if (isLoading) {
    return (
      <div className="aiml-detail-page">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="aiml-detail-page">
        <div className="container">
          <ErrorMessage
            message="Failed to load article"
            onRetry={refetch}
          />
          <div className="error-actions">
            <button onClick={() => navigate('/ai-ml')} className="btn-back">
              <ArrowLeft size={20} />
              Back to AI/ML News
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aiml-detail-page">
      {/* Sticky Header */}
      <div className="article-header-sticky">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="article-container">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/ai-ml" className="breadcrumb-link">AI/ML News</Link>
            <ChevronRight size={16} />
            <Link to={`/ai-ml?category=${article.category}`} className="breadcrumb-link">
              {article.category}
            </Link>
            <ChevronRight size={16} />
            <span className="breadcrumb-current">Article</span>
          </nav>

          {/* Category Badges */}
          <div className="category-badges">
            <span className="badge badge-primary">
              <Tag size={14} />
              {article.category}
            </span>
            {article.technologyType && (
              <span className="badge badge-secondary">{article.technologyType}</span>
            )}
            {article.aiModel && (
              <span className="badge badge-ai">
                <Cpu size={14} />
                {article.aiModel}
              </span>
            )}
            {article.isTrending && (
              <span className="badge badge-trending">
                <TrendingUp size={14} />
                Trending
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="article-title">{article.headline}</h1>

          {/* Brief Content / Summary */}
          {article.briefContent && (
            <p className="article-summary">{article.briefContent}</p>
          )}

          {/* Meta Information */}
          <div className="article-meta">
            <div className="meta-left">
              <div className="meta-items">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="meta-item">
                  <Eye size={16} />
                  <span>{formatViewCount(article.viewCount)} views</span>
                </div>
                {article.shareCount > 0 && (
                  <div className="meta-item">
                    <Share2 size={16} />
                    <span>{formatViewCount(article.shareCount)} shares</span>
                  </div>
                )}
                {formatRelevanceScore(article.relevanceScore) && (
                  <div className="meta-item relevance">
                    <Star size={16} />
                    <span>{formatRelevanceScore(article.relevanceScore)}/10</span>
                  </div>
                )}
              </div>

              {/* Company Mentioned */}
              {article.companyMentioned && (
                <div className="company-info">
                  <Building size={16} />
                  <span>{article.companyMentioned}</span>
                </div>
              )}
            </div>

            <div className="meta-actions">
              <button 
                onClick={handleShare} 
                className={`action-btn ${shared ? 'action-active' : ''}`}
                title="Share article"
              >
                <Share2 size={20} />
                <span className="action-label">Share</span>
              </button>
              <button 
                onClick={handleBookmark} 
                className={`action-btn ${bookmarked ? 'action-active' : ''}`}
                title="Bookmark article"
              >
                <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
                <span className="action-label">Save</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="featured-image-container">
              <img 
                src={article.featuredImage} 
                alt={article.headline}
                className="featured-image"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Main Article Content */}
          <div className="article-content">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : article.briefContent ? (
              <div>
                <p>{article.briefContent}</p>
              </div>
            ) : (
              <div>
                <p>Content not available.</p>
              </div>
            )}
          </div>

          {/* Source Information */}
          {article.sourceUrl && (
            <div className="article-source">
              <strong>Original Source:</strong>{' '}
              <a 
                href={article.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="source-link"
              >
                View Original Article
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Tags */}
          {article.tags && (
            <div className="article-tags">
              <h4 className="tags-title">Related Topics:</h4>
              <div className="tags-list">
                {article.tags.split(',').map((tag, idx) => (
                  <Link
                    key={idx} 
                    to={`/ai-ml?q=${encodeURIComponent(tag.trim())}`}
                    className="tag"
                  >
                    {tag.trim()}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer Stats */}
          <div className="article-footer-stats">
            <div className="stat-item">
              <Eye size={18} />
              <span>{formatViewCount(article.viewCount)} views</span>
            </div>
            <div className="stat-item">
              <Share2 size={18} />
              <span>{formatViewCount(article.shareCount)} shares</span>
            </div>
          </div>

          {/* Related Articles Section */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="related-articles-section">
              <h3 className="related-title">Related Articles</h3>
              <div className="related-grid">
                {article.relatedArticles.map(related => (
                  <Link 
                    key={related.id}
                    to={`/ai-ml/${related.id}`}
                    className="related-card"
                  >
                    {related.featuredImage && (
                      <img 
                        src={related.featuredImage} 
                        alt={related.headline}
                        className="related-image"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="related-content">
                      <span className="related-category">{related.category}</span>
                      <h4 className="related-headline">{related.headline}</h4>
                      {related.briefContent && (
                        <p className="related-summary">{related.briefContent}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default AiMlDetailPage;