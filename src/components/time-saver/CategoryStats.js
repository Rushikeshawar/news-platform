// src/components/CategoryStats.js
import React from 'react';
import { Calendar, Zap, TrendingUp, Clock, BarChart3, Users, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/components/CategoryStats.css';

const CategoryStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="category-stats">
        <div className="stats-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const statsCards = [
    { id: 'todayNewCount', title: "Today's New", value: stats.todayNewCount || 0, icon: Calendar, color: 'blue', description: 'Fresh content today' },
    { id: 'criticalCount', title: 'Breaking & Critical', value: stats.criticalCount || 0, icon: Zap, color: 'red', description: 'Priority updates' },
    { id: 'weeklyCount', title: 'Weekly Highlights', value: stats.weeklyCount || 0, icon: TrendingUp, color: 'green', description: 'Top stories this week' },
    { id: 'viralBuzzCount', title: 'Viral & Buzz', value: stats.viralBuzzCount || 0, icon: BarChart3, color: 'purple', description: 'Trending content' },
    { id: 'changingNormsCount', title: 'Changing Norms', value: stats.changingNormsCount || 0, icon: Users, color: 'orange', description: 'Social & cultural shifts' },
    { id: 'monthlyCount', title: 'Monthly Top', value: stats.monthlyCount || 0, icon: RefreshCw, color: 'teal', description: 'Best of the month' }
  ];

  return (
    <div className="category-stats">
      <div className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title">
            <Clock size={22} />
            Content Overview
          </h2>
          {stats.lastUpdated && (
            <p className="last-updated">
              Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="stats-grid">
          {statsCards.map(({ id, title, value, icon: Icon, color, description }) => (
            <div key={id} className={`stat-card ${color}`}>
              <div className="stat-icon"><Icon size={22} /></div>
              <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <div className="stat-value">{value}</div>
                <p className="stat-description">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Total Stories</span>
            <span className="summary-value">{stats.storiesCount || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Updates</span>
            <span className="summary-value">{stats.updatesCount || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Breaking</span>
            <span className="summary-value">{stats.breakingCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;