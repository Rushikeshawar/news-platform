import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { timeSaverService } from '../services/timeSaverService';
import TimeSaverCard from '../components/time-saver/TimeSaverCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';
import { 
  Clock, 
  Zap, 
  TrendingUp, 
  Calendar, 
  Filter,
  RefreshCw
} from 'lucide-react';
import '../styles/pages/TimeSaverPage.css';

const TimeSaverPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    category: searchParams.get('category') || '',
    contentGroup: searchParams.get('contentGroup') || '',
    sortBy: searchParams.get('sortBy') || 'publishedAt',
    order: searchParams.get('order') || 'desc'
  });

  // Fetch time saver content
  const { data: contentData, isLoading, error, refetch } = useQuery(
    ['timesaver-content', filters],
    () => timeSaverService.getContent(filters),
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 // 1 minute cache
    }
  );

  // Fetch stats
  const { data: statsData } = useQuery(
    'timesaver-stats',
    () => timeSaverService.getStats(),
    { 
      staleTime: 2 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000 // Auto refresh every 5 minutes
    }
  );

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && !(key === 'page' && value === 1)) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // reset to first page
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      category: '',
      contentGroup: '',
      sortBy: 'publishedAt',
      order: 'desc'
    });
  };

  const content = contentData?.data?.content || [];
  const pagination = contentData?.data?.pagination || {};
  const stats = statsData?.data?.stats || {};

  const contentGroups = [
    { id: '', label: 'All Content', icon: Clock },
    { id: 'today_new', label: "Today's New", icon: Calendar },
    { id: 'breaking_critical', label: 'Breaking & Critical', icon: Zap },
    { id: 'weekly_highlights', label: 'Weekly Highlights', icon: TrendingUp },
    { id: 'brief_updates', label: 'Brief Updates', icon: RefreshCw },
    { id: 'viral_buzz', label: 'Viral & Buzz', icon: TrendingUp },
  ];

  const categories = [
    'GENERAL', 'TECHNOLOGY', 'BUSINESS', 'SCIENCE', 'HEALTH', 
    'POLITICS', 'SPORTS', 'ENTERTAINMENT'
  ];

  if (error) {
    return (
      <div className="timesaver-page">
        <div className="container">
          <ErrorMessage 
            message="Failed to load Time Saver content. Please try again."
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="timesaver-page">
      <div className="container">
        
        {/* Page Header */}
        <header className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <Clock size={32} />
              <span>Time Saver Content</span>
            </h1>
            <p className="page-description">
              Stay updated quickly with short reads, critical updates, and trending insights 
              designed for your busy schedule.
            </p>
          </div>
        </header>

        <div className="timesaver-layout">
          {/* Sidebar */}
          <aside className="timesaver-sidebar">
            {/* Content Groups */}
            <section className="sidebar-section">
              <h3 className="sidebar-title">
                <Filter size={18} />
                <span>Content Groups</span>
              </h3>
              <div className="content-groups">
                {contentGroups.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    className={`group-btn ${filters.contentGroup === id ? 'active' : ''}`}
                    onClick={() => handleFilterChange({ contentGroup: id })}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                    {stats[`${id}Count`] > 0 && (
                      <span className="count">{stats[`${id}Count`]}</span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Categories */}
            <section className="sidebar-section">
              <h3 className="sidebar-title">
                <Filter size={18} />
                <span>Categories</span>
              </h3>
              <div className="categories-list">
                <button
                  className={`category-btn ${!filters.category ? 'active' : ''}`}
                  onClick={() => handleFilterChange({ category: '' })}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${filters.category === category ? 'active' : ''}`}
                    onClick={() => handleFilterChange({ category })}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            {/* Quick Stats */}
            <section className="sidebar-section quick-stats-section">
              <h3 className="sidebar-title">
                <TrendingUp size={18} />
                <span>Quick Stats</span>
              </h3>
              <div className="quick-stats">
                <div className="stat-item">
                  <span className="stat-label">Stories Today</span>
                  <span className="stat-value">{stats.storiesCount || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Updates</span>
                  <span className="stat-value">{stats.updatesCount || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Breaking</span>
                  <span className="stat-value">{stats.breakingCount || 0}</span>
                </div>
              </div>
            </section>
          </aside>

          {/* Main Content */}
          <main className="timesaver-main">
            
            {/* Active Filters */}
            {(filters.category || filters.contentGroup) && (
              <div className="active-filters">
                {filters.contentGroup && (
                  <span className="filter-tag">
                    Group: {contentGroups.find(g => g.id === filters.contentGroup)?.label}
                  </span>
                )}
                {filters.category && (
                  <span className="filter-tag">
                    Category: {filters.category}
                  </span>
                )}
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All
                </button>
              </div>
            )}

            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <span>{pagination.totalCount || 0} items found</span>
                )}
              </div>
              <div className="sort-controls">
                <select
                  value={`${filters.sortBy}-${filters.order}`}
                  onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    handleFilterChange({ sortBy, order });
                  }}
                  className="sort-select"
                >
                  <option value="publishedAt-desc">Newest First</option>
                  <option value="publishedAt-asc">Oldest First</option>
                  <option value="viewCount-desc">Most Viewed</option>
                  <option value="readTimeSeconds-asc">Quick Reads First</option>
                </select>
              </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
              <LoadingSpinner />
            ) : content.length > 0 ? (
              <>
                <div className="timesaver-grid">
                  {content.map((item) => (
                    <TimeSaverCard key={item.id} content={item} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    showInfo={true}
                    totalItems={pagination.totalCount}
                  />
                )}
              </>
            ) : (
              <div className="no-results">
                <Clock size={48} className="no-results-icon" />
                <h3>No content found</h3>
                <p>Try adjusting your filters or check back later for new updates.</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TimeSaverPage;