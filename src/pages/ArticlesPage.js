import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { articlesService } from '../services/articlesService';
import ArticleCard from '../components/articles/ArticleCard';
import SearchForm from '../components/articles/SearchForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';
import { Filter, Grid, List, TrendingUp, X, ChevronDown } from 'lucide-react';
import '../styles/pages/ArticlesPage.css';

const ArticlesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'publishedAt',
    order: searchParams.get('order') || 'desc',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') === 'true'
  });

  // Fetch articles
  const { data: articlesData, isLoading, error, refetch } = useQuery(
    ['articles', filters],
    () => articlesService.getArticles(filters),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000
    }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => articlesService.getCategories(),
    { staleTime: 10 * 60 * 1000 }
  );

  // Fetch trending articles
  const { data: trendingData } = useQuery(
    'trending-articles-sidebar',
    () => articlesService.getTrendingArticles({ limit: 5 }),
    { staleTime: 5 * 60 * 1000 }
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== false && !(key === 'page' && value === 1) && !(key === 'limit')) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params, { replace: true });
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

  // Prevent body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
    // Close mobile filters after selection on mobile
    if (window.innerWidth <= 1024) {
      setShowMobileFilters(false);
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (searchData) => {
    handleFilterChange(searchData);
  };

  const handleCategoryClick = (categoryName) => {
    handleFilterChange({ category: categoryName });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      category: '',
      sortBy: 'publishedAt',
      order: 'desc',
      search: '',
      featured: false
    });
    setShowMobileFilters(false);
  };

  const handleTrendingClick = (articleId) => {
    setShowMobileFilters(false);
    navigate(`/articles/${articleId}`);
  };

  const articles = articlesData?.data?.articles || [];
  const pagination = articlesData?.data?.pagination || {};
  const categories = categoriesData?.data?.categories || [];
  const trendingArticles = trendingData?.data?.articles || [];

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.featured
  ].filter(Boolean).length;

  if (error) {
    return (
      <div className="articles-page">
        <div className="container">
          <ErrorMessage 
            message="Failed to load articles" 
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Articles</h1>
            <p className="page-description">
              Discover the latest news, insights, and stories from around the world
            </p>
          </div>
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button 
          className="mobile-filter-toggle"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          aria-label="Toggle filters"
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

        <div className="articles-layout">
          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div 
              className="mobile-filter-overlay"
              onClick={() => setShowMobileFilters(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar - with mobile dropdown */}
          <aside className={`articles-sidebar ${showMobileFilters ? 'show-mobile' : ''}`}>
            {/* Mobile Close Button */}
            <button 
              className="mobile-filter-close"
              onClick={() => setShowMobileFilters(false)}
              aria-label="Close filters"
            >
              <X size={24} />
            </button>

            {/* Search Form */}
            <div className="sidebar-section">
              <SearchForm 
                onSearch={handleSearch}
                initialValues={filters}
                categories={categories}
              />
            </div>

            {/* Active Filters */}
            {(filters.category || filters.search || filters.featured) && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">Active Filters</h3>
                <div className="active-filters">
                  {filters.category && (
                    <span className="filter-tag">
                      <span>Category: {filters.category}</span>
                      <button 
                        onClick={() => handleFilterChange({ category: '' })}
                        aria-label="Remove category filter"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'white', 
                          cursor: 'pointer',
                          padding: '0',
                          marginLeft: '4px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filters.search && (
                    <span className="filter-tag">
                      <span>Search: "{filters.search}"</span>
                      <button 
                        onClick={() => handleFilterChange({ search: '' })}
                        aria-label="Remove search filter"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'white', 
                          cursor: 'pointer',
                          padding: '0',
                          marginLeft: '4px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filters.featured && (
                    <span className="filter-tag">
                      <span>Featured Only</span>
                      <button 
                        onClick={() => handleFilterChange({ featured: false })}
                        aria-label="Remove featured filter"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'white', 
                          cursor: 'pointer',
                          padding: '0',
                          marginLeft: '4px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  <button onClick={clearFilters} className="clear-filters-btn">
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">
                <Filter size={18} />
                Categories
              </h3>
              <div className="categories-list">
                <button
                  className={`category-btn ${!filters.category ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('')}
                >
                  All Categories
                  <span className="article-count">
                    ({categories.reduce((sum, cat) => sum + cat.articleCount, 0)})
                  </span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`category-btn ${filters.category === category.name ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <span>{category.name}</span>
                    <span className="article-count">({category.articleCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Articles */}
            {trendingArticles.length > 0 && (
              <div className="sidebar-section">
                <h3 className="sidebar-title">
                  <TrendingUp size={18} />
                  Trending
                </h3>
                <div className="trending-list">
                  {trendingArticles.map((article) => (
                    <div
                      key={article.id} 
                      className="trending-item"
                      onClick={() => handleTrendingClick(article.id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleTrendingClick(article.id);
                        }
                      }}
                    >
                      <h4 className="trending-title">{article.title}</h4>
                      <div className="trending-meta">
                        <span className="view-count">{article.viewCount} views</span>
                        <span className="category">{article.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="articles-main">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <span>
                    <strong>{pagination.totalCount || 0}</strong> articles found
                    {filters.category && ` in ${filters.category}`}
                    {filters.search && ` for "${filters.search}"`}
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
                  aria-label="Sort articles"
                >
                  <option value="publishedAt-desc">Newest First</option>
                  <option value="publishedAt-asc">Oldest First</option>
                  <option value="viewCount-desc">Most Viewed</option>
                  <option value="shareCount-desc">Most Shared</option>
                </select>
              </div>
            </div>

            {/* Articles Grid/List */}
            {isLoading ? (
              <LoadingSpinner />
            ) : articles.length > 0 ? (
              <>
                <div className={`articles-grid ${viewMode}`}>
                  {articles.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      viewMode={viewMode}
                    />
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
                <h3>No articles found</h3>
                <p>
                  {filters.category || filters.search || filters.featured
                    ? 'Try adjusting your search criteria or browse different categories.'
                    : 'No articles available at the moment.'}
                </p>
                {(filters.category || filters.search || filters.featured) && (
                  <button onClick={clearFilters} className="clear-filters-btn">
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;