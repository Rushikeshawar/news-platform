 
// src/components/time-saver/TimeSaverList.js
import React from 'react';
import TimeSaverCard from './TimeSaverCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const TimeSaverList = ({ content, loading, error }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load time saver content" />;
  
  if (!content || content.length === 0) {
    return (
      <div className="no-results">
        <h3>No content found</h3>
        <p>Check back later for new time saver content</p>
      </div>
    );
  }

  return (
    <div className="timesaver-list">
      <div className="timesaver-grid">
        {content.map(item => (
          <TimeSaverCard key={item.id} content={item} />
        ))}
      </div>
    </div>
  );
};

export default TimeSaverList;

