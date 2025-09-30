import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { articlesService } from '../services/articlesService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { 
  Calendar, 
  Eye, 
  Share2, 
  User, 
  Clock, 
  ArrowLeft,
  Heart,
  Tag
} from 'lucide-react';

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch article with view tracking
  const { data: articleData, isLoading, error } = useQuery(
    ['article', id],
    () => articlesService.getArticleById(id, { trackView: true }),
    { 
      enabled: !!id,
      retry: 1 
    }
  );

  // Share mutation
  const shareMutation = useMutation(
    () => articlesService.shareArticle(id)
  );

  const article = articleData?.data?.article;

  const handleShare = async () => {
    try {
      await shareMutation.mutateAsync();
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary || article.excerpt,
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <LoadingSpinner message="Loading article..." />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ padding: '4rem 0' }}>
        <div className="container">
          <ErrorMessage 
            message="Failed to load article. The article may not exist or there was a network error." 
            onRetry={() => window.location.reload()}
          />
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/articles" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none'
            }}>
              <ArrowLeft size={18} />
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back Button */}
        <div style={{ padding: '2rem 0 1rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              color: '#4b5563'
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {/* Article Container */}
        <article style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Featured Image */}
          {article.imageUrl && (
            <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
              <img 
                src={article.imageUrl} 
                alt={article.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div style={{ padding: '3rem' }}>
            {/* Category Badge */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {article.category}
              </span>
              {article.featured && (
                <span style={{
                  display: 'inline-block',
                  marginLeft: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#f59e0b',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              marginBottom: '1.5rem',
              color: '#111827'
            }}>
              {article.title}
            </h1>

            {/* Meta Information */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              paddingBottom: '1.5rem',
              marginBottom: '2rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              {article.author && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                  <User size={18} />
                  <span style={{ fontWeight: '500' }}>{article.author.fullName || article.author.name}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                <Calendar size={18} />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                <Eye size={18} />
                <span>{article.viewCount || 0} views</span>
              </div>
              {article.readTime && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                  <Clock size={18} />
                  <span>{article.readTime} min read</span>
                </div>
              )}
            </div>

            {/* Summary/Excerpt */}
            {(article.summary || article.excerpt) && (
              <div style={{
                padding: '1.5rem',
                background: '#f3f4f6',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0.5rem',
                marginBottom: '2rem'
              }}>
                <p style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.75',
                  color: '#374151',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  {article.summary || article.excerpt}
                </p>
              </div>
            )}

            {/* Article Content */}
            {article.content && (
              <div 
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.8',
                  color: '#1f2937',
                  marginBottom: '2rem'
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}

            {/* Tags */}
            {article.tags && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <Tag size={18} style={{ color: '#9ca3af', marginRight: '0.5rem' }} />
                {article.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f3f4f6',
                      color: '#4b5563',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '2px solid #e5e7eb'
            }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                <Share2 size={18} />
                Share Article
              </button>
            </div>
          </div>
        </article>

        {/* Related Articles Section (Optional) */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            More from {article.category}
          </h2>
          <Link 
            to={`/articles?category=${article.category}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'white',
              border: '2px solid #3b82f6',
              color: '#3b82f6',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            View All {article.category} Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsPage;