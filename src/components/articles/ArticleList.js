 
// src/components/articles/ArticleList.js
import React from 'react';
import ArticleCard from './ArticleCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ArticleList = ({ articles, loading, error, viewMode = 'grid' }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load articles" />;
  
  if (!articles || articles.length === 0) {
    return (
      <div className="no-results">
        <h3>No articles found</h3>
        <p>Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="article-list">
      <div className={`articles-grid ${viewMode}`}>
        {articles.map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;

