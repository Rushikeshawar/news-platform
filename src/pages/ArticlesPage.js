import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { articlesService } from '../services/articlesService';
import ArticleCard from '../components/articles/ArticleCard';
import SearchForm from '../components/articles/SearchForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';
import { Filter, Grid, List, TrendingUp } from 'lucide-react';
import '../styles/pages/ArticlesPage.css';

const ArticlesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
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
      if (value && value !== '' && !(key === 'page' && value === 1) && !(key === 'limit')) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (searchData) => {
    handleFilterChange(searchData);
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
  };

  const articles = articlesData?.data?.articles || [];
  const pagination = articlesData?.data?.pagination || {};
  const categories = categoriesData?.data?.categories || [];
  const trendingArticles = trendingData?.data?.articles || [];

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

        <div className="articles-layout">
          {/* Sidebar */}
          <aside className="articles-sidebar">
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
                      Category: {filters.category}
                    </span>
                  )}
                  {filters.search && (
                    <span className="filter-tag">
                      Search: "{filters.search}"
                    </span>
                  )}
                  {filters.featured && (
                    <span className="filter-tag">
                      Featured Only
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
                  onClick={() => handleFilterChange({ category: '' })}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`category-btn ${filters.category === category.name ? 'active' : ''}`}
                    onClick={() => handleFilterChange({ category: category.name })}
                  >
                    {category.name}
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
                    <Link 
                      key={article.id} 
                      to={`/articles/${article.id}`}
                      className="trending-item"
                    >
                      <h4 className="trending-title">{article.title}</h4>
                      <div className="trending-meta">
                        <span className="view-count">{article.viewCount} views</span>
                        <span className="category">{article.category}</span>
                      </div>
                    </Link>
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
                    {pagination.totalCount || 0} articles found
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
                >
                  <option value="publishedAt-desc">Newest First</option>
                  <option value="publishedAt-asc">Oldest First</option>
                  <option value="viewCount-desc">Most Viewed</option>
                  <option value="shareCount-desc">Most Shared</option>
                  {/* <option value="title-asc">Title A-Z</option> */}
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

export default ArticlesPage;