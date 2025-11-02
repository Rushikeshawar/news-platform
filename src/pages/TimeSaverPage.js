import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Filter, Clock, X, ChevronDown } from 'lucide-react';
import '../styles/pages/TimeSaverPage.css';

const TimeSaverPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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

  // Close mobile filters when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setShowMobileFilters(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        setContent(response.data.data || []);
        setPagination(response.data.pagination || {});
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.response?.data?.message || 'Failed to load content');
      setContent([]);
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

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    setShowMobileFilters(false);
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

  const activeFilterCount = [
    filters.category !== 'ALL' ? filters.category : null,
    filters.contentGroup
  ].filter(Boolean).length;

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
        <div className="header-content">
          <h1 className="page-title">
            <Clock size={32} />
            TimeSaver
          </h1>
          <p className="page-description">
            Quick updates and highlights to save your time
          </p>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <button 
        className="mobile-filter-toggle"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        <Filter size={20} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="filter-count-badge">{activeFilterCount}</span>
        )}
        <ChevronDown 
          size={20} 
          className={`chevron ${showMobileFilters ? 'rotated' : ''}`}
        />
      </button>

      {/* Main Layout with Sidebar and Content */}
      <div className="timesaver-layout">
        {/* Sidebar Filters - with mobile dropdown */}
        <aside className={`timesaver-sidebar ${showMobileFilters ? 'show-mobile' : ''}`}>
          {/* Mobile Close Button */}
          <button 
            className="mobile-filter-close"
            onClick={() => setShowMobileFilters(false)}
          >
            <X size={24} />
          </button>

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <Filter size={18} />
              Filters
            </h3>

            {/* Content Group Filter */}
            <div className="filter-section">
              <div className="filter-section-title">Content Type</div>
              <div className="filter-options">
                {contentGroups.map(group => (
                  <button
                    key={group.value}
                    onClick={() => handleFilterChange({ contentGroup: group.value })}
                    className={`filter-option ${filters.contentGroup === group.value ? 'active' : ''}`}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <div className="filter-section-title">Category</div>
              <div className="filter-options">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange({ category: cat })}
                    className={`filter-option ${filters.category === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div 
            className="mobile-filter-overlay"
            onClick={() => setShowMobileFilters(false)}
          />
        )}

        {/* Main Content */}
        <div className="timesaver-main">
          {/* Active Filters */}
          {(filters.category !== 'ALL' || filters.contentGroup) && (
            <div className="active-filters">
              {filters.category !== 'ALL' && (
                <span className="filter-tag">
                  Category: {filters.category}
                </span>
              )}
              {filters.contentGroup && (
                <span className="filter-tag">
                  Type: {contentGroups.find(g => g.value === filters.contentGroup)?.label}
                </span>
              )}
              <button 
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: 'ALL', contentGroup: '', page: 1 }));
                  setShowMobileFilters(false);
                }} 
                className="clear-filters-btn"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="results-header">
            <div className="results-info">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>
                  {pagination.totalCount || content.length} items found
                </span>
              )}
            </div>
          </div>

          {content.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} className="empty-state-icon" />
              <h3>No content found</h3>
              <p>Try adjusting your filters to see more content.</p>
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
                    disabled={!pagination.hasMore || pagination.page === 1}
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
                    disabled={!pagination.hasMore}
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