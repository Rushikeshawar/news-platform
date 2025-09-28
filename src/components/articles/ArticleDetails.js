// src/components/articles/ArticleDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { articlesService } from '../../services/articlesService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { Calendar, Eye, Share2, User, Clock } from 'lucide-react';

const ArticleDetails = () => {
  const { id } = useParams();
  
  const { data: articleData, isLoading, error } = useQuery(
    ['article', id],
    () => articlesService.getArticleById(id),
    { enabled: !!id }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load article" />;

  const article = articleData?.data?.article;
  if (!article) return <ErrorMessage message="Article not found" />;

  return (
    <div className="article-details">
      <div className="container">
        <article className="article-content">
          <header className="article-header">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span><Calendar size={16} /> {new Date(article.publishedAt).toLocaleDateString()}</span>
              <span><Eye size={16} /> {article.viewCount} views</span>
              {article.author && (
                <span><User size={16} /> {article.author.fullName}</span>
              )}
              {article.readTime && (
                <span><Clock size={16} /> {article.readTime} min read</span>
              )}
            </div>
          </header>
          
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="featured-image" />
          )}
          
          <div className="article-body">
            {article.summary && (
              <div className="article-summary">
                <p>{article.summary}</p>
              </div>
            )}
            
            {article.content && (
              <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetails;

