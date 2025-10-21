// src/components/ai-ml/AiMlDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { aiMlService } from '../../services/aiMlService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { Brain, Calendar, Eye, Share2, Building, Cpu } from 'lucide-react';

const AiMlDetails = () => {
  const { id } = useParams();
  
  const { data: articleData, isLoading, error } = useQuery(
    ['aiml-article', id],
    () => aiMlService.getAiMlArticleById(id),
    { enabled: !!id }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load article" />;

  const article = articleData?.data?.article;
  if (!article) return <ErrorMessage message="Article not found" />;

  return (
    <div className="aiml-details">
      <div className="container">
        <article className="article-content">
          <header className="article-header">
            <h1>{article.headline}</h1>
            <div className="article-meta">
              <span><Calendar size={16} /> {new Date(article.publishedAt).toLocaleDateString()}</span>
              <span><Eye size={16} /> {article.viewCount} views</span>
              {article.companyMentioned && (
                <span><Building size={16} /> {article.companyMentioned}</span>
              )}
              {article.aiModel && (
                <span><Cpu size={16} /> {article.aiModel}</span>
              )}
            </div>
          </header>
          
          {article.featuredImage && (
            <img src={article.featuredImage} alt={article.headline} className="featured-image" />
          )}
          
          <div className="article-body">
            <div className="brief-content">
              <p>{article.briefContent}</p>
            </div>
            
            {article.fullContent && (
              <div className="full-content" dangerouslySetInnerHTML={{ __html: article.fullContent }} />
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default AiMlDetails; 