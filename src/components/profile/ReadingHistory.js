 
// src/components/profile/ReadingHistory.js
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { userService } from '../../services/userService';
import { 
  Clock, 
  Eye, 
  Calendar,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';

const ReadingHistory = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'updatedAt',
    order: 'desc'
  });

  const { data: historyData, isLoading } = useQuery(
    ['reading-history', filters],
    () => userService.getReadingHistory(filters),
    { keepPreviousData: true }
  );

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const formatReadTime = (seconds) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatProgress = (progress) => {
    return Math.round((progress || 0) * 100);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading reading history..." />;
  }

  const history = historyData?.data?.history || [];
  const pagination = historyData?.data?.pagination || {};

  return (
    <div className="reading-history">
      <div className="history-header">
        <h2>
          <BookOpen size={24} />
          Reading History
        </h2>
        <p>Track your reading progress and revisit articles</p>
      </div>

      {/* Sort Controls */}
      <div className="history-controls">
        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            setFilters(prev => ({ ...prev, sortBy, order, page: 1 }));
          }}
          className="sort-select"
        >
          <option value="updatedAt-desc">Recently Read</option>
          <option value="timeSpent-desc">Most Time Spent</option>
          <option value="readProgress-desc">Most Progress</option>
          <option value="createdAt-desc">Recently Added</option>
        </select>
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <>
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="article-info">
                  <h3 className="article-title">{item.article?.title}</h3>
                  <p className="article-category">{item.article?.category}</p>
                </div>
                
                <div className="reading-stats">
                  <div className="stat">
                    <Clock size={14} />
                    <span>{formatReadTime(item.timeSpent)}</span>
                  </div>
                  
                  <div className="stat">
                    <TrendingUp size={14} />
                    <span>{formatProgress(item.readProgress)}%</span>
                  </div>
                  
                  <div className="stat">
                    <Calendar size={14} />
                    <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${formatProgress(item.readProgress)}%` }}
                  />
                </div>
              </div>
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
        <div className="no-history">
          <BookOpen size={48} />
          <h3>No reading history yet</h3>
          <p>Start reading articles to track your progress here</p>
        </div>
      )}
    </div>
  );
};

export default ReadingHistory;

