import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/TimeSaverPage.css';

const TimeSaverPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: 'ALL',
    contentGroup: ''
  });

  const navigate = useNavigate();

  const contentGroups = [
    { value: '', label: 'All Content' },
    { value: 'today_new', label: "Today's New" },
    { value: 'breaking_critical', label: 'Breaking & Critical' },
    { value: 'weekly_highlights', label: 'Weekly Highlights' },
    { value: 'monthly_top', label: 'Monthly Top' },
    { value: 'brief_updates', label: 'Brief Updates' },
    { value: 'viral_buzz', label: 'Viral & Buzz' },
    { value: 'changing_norms', label: 'Changing Norms' }
  ];

  const categories = [
    'ALL', 'TECHNOLOGY', 'BUSINESS', 'POLITICS', 'HEALTH', 
    'SCIENCE', 'ENTERTAINMENT', 'SPORTS', 'OTHER'
  ];

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: filters.limit,
        includeLinked: 'true'
      };

      if (filters.category !== 'ALL') {
        params.category = filters.category;
      }

      if (filters.contentGroup) {
        params.contentGroup = filters.contentGroup;
      }

      const response = await axios.get('/api/time-saver/content', { params });
      
      if (response.data.success) {
        setContent(response.data.data.content);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (contentId) => {
    navigate(`/time-saver/${contentId}`);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      OTHER: 'card-category-other'
    };
    return colors[category] || colors.OTHER;
  };

  const formatReadTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.ceil(seconds / 60)}m`;
  };

  if (loading && content.length === 0) {
    return (
      <div className="page-loading">
        <div className="page-spinner"></div>
        <p className="page-loading-text">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <div className="page-error-content">
          <p className="page-error-text">{error}</p>
          <button onClick={fetchContent} className="page-error-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="timesaver-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">TimeSaver</h1>
          <p className="page-description">Quick updates and highlights to save your time</p>
        </div>
      </div>

      {/* Main Layout with Sidebar and Content */}
      <div className="timesaver-layout">
        {/* Sidebar Filters */}
        <aside className="timesaver-sidebar">
          <h3 className="sidebar-title">Filters</h3>

          {/* Content Group Filter */}
          <div className="filter-section">
            <div className="filter-section-title">Filter by Content Type</div>
            <div className="filter-options">
              {contentGroups.map(group => (
                <button
                  key={group.value}
                  onClick={() => setFilters(prev => ({ ...prev, contentGroup: group.value, page: 1 }))}
                  className={`filter-option ${filters.contentGroup === group.value ? 'active' : ''}`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <div className="filter-section-title">Filter by Category</div>
            <div className="filter-options">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat, page: 1 }))}
                  className={`filter-option ${filters.category === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="timesaver-main">
          {content.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No content found</p>
            </div>
          ) : (
            <>
              <div className="timesaver-grid">
                {content.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item.id)}
                    className="content-card"
                  >
                    {/* Card Image */}
                    {item.imageUrl && (
                      <div className="card-image-container">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="card-image"
                        />
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="card-content">
                      {/* Priority Badge */}
                      {item.isPriority && (
                        <span className="card-priority-badge">
                          🔥 Priority
                        </span>
                      )}

                      {/* Category & Read Time */}
                      <div className="card-meta">
                        <span className={`category-badge ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        <span className="card-read-time">
                          ⏱️ {formatReadTime(item.readTimeSeconds)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="card-title">
                        {item.title}
                      </h3>

                      {/* Summary */}
                      <p className="card-summary">
                        {item.summary}
                      </p>

                      {/* Footer */}
                      <div className="card-footer">
                        <div className="card-stats">
                          <span className="stat-item">👁️ {item.viewCount || 0}</span>
                          {item.linkedArticleId && (
                            <span className="stat-item linked-article">📰 Article</span>
                          )}
                          {item.linkedAiArticleId && (
                            <span className="stat-item linked-ai">🤖 AI</span>
                          )}
                        </div>
                        <span className="card-read-more">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination-section">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="pagination-button"
                  >
                    Previous
                  </button>

                  <div className="pagination-numbers">
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.page) <= 1
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`pagination-number ${pagination.page === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (Math.abs(pageNum - pagination.page) === 2) {
                        return <span key={pageNum} className="pagination-ellipsis">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSaverPage;