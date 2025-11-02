import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { aiMlService } from '../services/aiMlService';
import AiMlCard from '../components/ai-ml/AiMlCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';
import { Brain, Search, Filter, TrendingUp, Cpu, Zap, X, ChevronDown } from 'lucide-react';
import '../styles/pages/AiMlPage.css';
import debounce from 'lodash.debounce';

const AiMlPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'publishedAt',
    order: searchParams.get('order') || 'desc',
    q: searchParams.get('q') || ''
  });
  const [searchQuery, setSearchQuery] = useState(filters.q);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        handleFilterChange({ q: query });
      }, 600),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Fetch AI/ML news
  const { data: aiMlData, isLoading, error, refetch } = useQuery(
    ['aiml-news', filters],
    () =>
      filters.q
        ? aiMlService.searchAiMlContent(filters)
        : aiMlService.getAiMlNews(filters),
    { keepPreviousData: true, staleTime: 2 * 60 * 1000 }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'aiml-categories',
    aiMlService.getAiMlCategories,
    { staleTime: 10 * 60 * 1000 }
  );

  // Fetch trending articles
  const { data: trendingData } = useQuery(
    'trending-aiml-sidebar',
    () => aiMlService.getTrendingAiMl({ limit: 5 }),
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch popular topics
  const { data: topicsData } = useQuery(
    'popular-ai-topics',
    () => aiMlService.getPopularTopics({ limit: 10 }),
    { staleTime: 10 * 60 * 1000 }
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && !(key === 'page' && value === 1)) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

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

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      category: '',
      sortBy: 'publishedAt',
      order: 'desc',
      q: ''
    });
    setSearchQuery('');
    setShowMobileFilters(false);
  };

  const articles = aiMlData?.data?.articles || [];
  const pagination = aiMlData?.data?.pagination || {};
  const categories = categoriesData?.data?.categories || [];
  const trendingArticles = trendingData?.data?.articles || [];
  const popularTopics = topicsData?.data?.topics || [];

  const activeFilterCount = [
    filters.category,
    filters.q
  ].filter(Boolean).length;

  if (error) {
    return (
      <div className="aiml-page">
        <div className="container">
          <ErrorMessage
            message="Failed to load AI/ML content"
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="aiml-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <Brain size={32} />
              AI/ML News & Insights
            </h1>
            <p className="page-description">
              Stay updated with the latest artificial intelligence and machine learning 
              developments, research breakthroughs, and industry trends.
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

        {/* Layout */}
        <div className="aiml-layout">
          {/* Sidebar - with mobile dropdown */}
          <aside className={`aiml-sidebar ${showMobileFilters ? 'show-mobile' : ''}`}>
            {/* Mobile Close Button */}
            <button 
              className="mobile-filter-close"
              onClick={() => setShowMobileFilters(false)}
            >
              <X size={24} />
            </button>

            {/* Categories */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">
                <Filter size={18} /> Categories
              </h3>
              <div className="categories-list">
                <button
                  className={`category-btn ${!filters.category ? 'active' : ''}`}
                  onClick={() => {
                    handleFilterChange({ category: '' });
                    setShowMobileFilters(false);
                  }}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`category-btn ${filters.category === category.name ? 'active' : ''}`}
                    onClick={() => {
                      handleFilterChange({ category: category.name });
                      setShowMobileFilters(false);
                    }}
                  >
                    {category.name}
                    {category.isHot && <span className="hot-badge">🔥</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            {popularTopics.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">
                  <Zap size={18} /> Popular Topics
                </h3>
                <div className="topics-list">
                  {popularTopics.map((topic, index) => (
                    <button
                      key={index}
                      className="topic-item"
                      onClick={() => {
                        handleFilterChange({ q: topic.topic });
                        setShowMobileFilters(false);
                      }}
                    >
                      <span className="topic-name">{topic.topic}</span>
                      {topic.score && (
                        <span className="topic-score">{topic.score}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Articles */}
            {trendingArticles.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">
                  <TrendingUp size={18} /> Trending in AI/ML
                </h3>
                <div className="trending-list">
                  {trendingArticles.map((article) => (
                    <div
                      key={article.id}
                      className="trending-item"
                      onClick={() => {
                        handleFilterChange({ q: article.headline });
                        setShowMobileFilters(false);
                      }}
                    >
                      <h4 className="trending-title">{article.headline}</h4>
                      <div className="trending-meta">
                        <span className="view-count">{article.viewCount} views</span>
                        {article.aiModel && (
                          <span className="ai-model">
                            <Cpu size={12} /> {article.aiModel}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div 
              className="mobile-filter-overlay"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* Main Content */}
          <main className="aiml-main">
            {/* Search Section */}
            <div className="search-section">
              <div className="search-container">
                {/* <Search size={20} className="search-icon" /> */}
                <input
                  type="text"
                  placeholder="Search AI/ML articles, companies, models..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="search-input"
                />
                {searchQuery && (
                  <X
                    size={18}
                    className="clear-search"
                    onClick={() => {
                      setSearchQuery('');
                      debouncedSearch('');
                    }}
                  />
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category || filters.q) && (
              <div className="active-filters">
                {filters.category && (
                  <span className="filter-tag">Category: {filters.category}</span>
                )}
                {filters.q && (
                  <span className="filter-tag">Search: "{filters.q}"</span>
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
                  <span>
                    {pagination.totalCount || 0} AI/ML articles found{' '}
                    {filters.q && `for "${filters.q}"`}
                  </span>
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
                  <option value="shareCount-desc">Most Shared</option>
                </select>
              </div>
            </div>

            {/* Articles Grid */}
            {isLoading ? (
              <LoadingSpinner />
            ) : articles.length > 0 ? (
              <>
                <div className="aiml-grid">
                  {articles.map((article) => (
                    <AiMlCard key={article.id} article={article} />
                  ))}
                </div>
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
                <Brain size={48} className="no-results-icon" />
                <h3>No AI/ML articles found</h3>
                <p>Try adjusting your search criteria or browse different categories.</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AiMlPage;