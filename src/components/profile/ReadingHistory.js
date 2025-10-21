import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Search, BookOpen } from 'lucide-react';
import '../../styles/components/ReadingHistory.css';

const ReadingHistory = ({ historyData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const history = historyData?.readingHistory || [];

  // Filter history based on search
  const filteredHistory = history.filter((item) => {
    if (searchQuery === '') return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      item.article?.headline?.toLowerCase().includes(searchLower) ||
      item.article?.category?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatReadingTime = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Group history by date
  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.updatedAt || item.createdAt);
    const dateKey = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {});

  return (
    <div className="reading-history">
      <div className="history-header">
        <div className="header-info">
          <h2 className="history-title">
            <Clock size={24} />
            Reading History
          </h2>
          <p className="history-count">
            {history.length} article{history.length !== 1 ? 's' : ''} read
          </p>
        </div>
        {history.length > 0 && (
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}
      </div>
      {history.length === 0 ? (
        <div className="empty-history">
          <BookOpen size={64} strokeWidth={1} />
          <h3>No reading history yet</h3>
          <p>Articles you read will appear here</p>
          <Link to="/articles" className="browse-btn">
            Start Reading
          </Link>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="empty-history">
          <Search size={64} strokeWidth={1} />
          <h3>No results found</h3>
          <p>Try a different search term</p>
          <button onClick={() => setSearchQuery('')} className="reset-btn">
            Clear Search
          </button>
        </div>
      ) : (
        <div className="history-timeline">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="history-group">
              <div className="group-date">
                <Calendar size={16} />
                <span>{date}</span>
              </div>
              <div className="history-items">
                {items.map((item) => (
                  <Link key={item.id} to={`/articles/${item.articleId}`} className="history-item">
                    <div className="history-image">
                      {item.article?.featuredImage ? (
                        <img src={item.article.featuredImage} alt={item.article.headline} />
                      ) : (
                        <div className="history-image-placeholder">
                          <BookOpen size={24} />
                        </div>
                      )}
                    </div>
                    <div className="history-content">
                      <h4 className="history-article-title">{item.article?.headline}</h4>
                      <div className="history-meta">
                        <span className="history-category">{item.article?.category || 'Uncategorized'}</span>
                        <span className="history-time">
                          <Clock size={14} />
                          {formatReadingTime(item.timeSpent)}
                        </span>
                      </div>
                      {item.readProgress !== undefined && item.readProgress > 0 && (
                        <div className="history-progress">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${item.readProgress * 100}%` }}
                            />
                          </div>
                          <span className="progress-text">{Math.round(item.readProgress * 100)}% complete</span>
                        </div>
                      )}
                    </div>
                    <div className="history-timestamp">{formatDate(item.updatedAt || item.createdAt)}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingHistory;