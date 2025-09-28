 
// src/components/time-saver/ContentGroup.js
import React from 'react';
import { useQuery } from 'react-query';
import { timeSaverService } from '../../services/timeSaverService';
import TimeSaverCard from './TimeSaverCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, Zap, TrendingUp, Clock } from 'lucide-react';

const ContentGroup = ({ groupId, title, limit = 6 }) => {
  const { data, isLoading } = useQuery(
    ['content-group', groupId],
    () => timeSaverService.getCategoryContent(groupId, { limit }),
    { 
      enabled: !!groupId,
      staleTime: 2 * 60 * 1000 
    }
  );

  const getGroupIcon = () => {
    switch (groupId) {
      case 'today_new': return Calendar;
      case 'breaking_critical': return Zap;
      case 'weekly_highlights': return TrendingUp;
      default: return Clock;
    }
  };

  const Icon = getGroupIcon();
  const content = data?.data?.content || [];

  return (
    <div className="content-group">
      <div className="group-header">
        <h3 className="group-title">
          <Icon size={20} />
          {title}
        </h3>
        <span className="content-count">
          {content.length} items
        </span>
      </div>

      {isLoading ? (
        <LoadingSpinner size="small" />
      ) : content.length > 0 ? (
        <div className="group-content">
          {content.map(item => (
            <TimeSaverCard key={item.id} content={item} />
          ))}
        </div>
      ) : (
        <p className="no-content">No content available</p>
      )}
    </div>
  );
};

export default ContentGroup;

