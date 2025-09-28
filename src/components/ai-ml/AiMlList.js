 
// src/components/ai-ml/AiMlList.js
import React from 'react';
import AiMlCard from './AiMlCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const AiMlList = ({ articles, loading, error }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load AI/ML articles" />;
  
  if (!articles || articles.length === 0) {
    return (
      <div className="no-results">
        <h3>No AI/ML articles found</h3>
        <p>Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="aiml-list">
      <div className="aiml-grid">
        {articles.map(article => (
          <AiMlCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default AiMlList;

