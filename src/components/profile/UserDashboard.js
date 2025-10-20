// src/components/profile/UserDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Heart, 
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import '../../styles/components/UserDashboard.css';

const UserDashboard = ({ user, dashboardData }) => {
  const stats = dashboardData?.stats || {
    totalArticlesRead: 0,
    totalReadingTime: 0,
    favoriteCount: 0,
    currentStreak: 0
  };

  const recentActivity = dashboardData?.recentActivity || [];
  const readingProgress = dashboardData?.readingProgress || [];

  const formatReadingTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const statCards = [
    {
      icon: BookOpen,
      label: 'Articles Read',
      value: stats.totalArticlesRead || 0,
      color: '#3182ce',
      bgColor: '#ebf8ff'
    },
    {
      icon: Clock,
      label: 'Reading Time',
      value: formatReadingTime(stats.totalReadingTime || 0),
      color: '#38a169',
      bgColor: '#f0fff4'
    },
    {
      icon: Heart,
      label: 'Favorites',
      value: stats.favoriteCount || 0,
      color: '#e53e3e',
      bgColor: '#fff5f5'
    },
    {
      icon: Award,
      label: 'Current Streak',
      value: `${stats.currentStreak || 0} days`,
      color: '#d69e2e',
      bgColor: '#fffff0'
    }
  ];

  return (
    <div className="user-dashboard">
      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="stat-card"
              style={{ 
                background: stat.bgColor,
                borderLeft: `4px solid ${stat.color}`
              }}
            >
              <div className="stat-icon" style={{ color: stat.color }}>
                <Icon size={32} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Reading Progress */}
      <div className="dashboard-sections">
        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={20} />
              Recent Activity
            </h2>
            <Link to="/profile?tab=history" className="view-all-link">
              View All
            </Link>
          </div>
          
          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={48} strokeWidth={1} />
                <p>No recent activity</p>
                <Link to="/articles" className="cta-link">
                  Start Reading
                </Link>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <Calendar size={16} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">{activity.description}</p>
                    <span className="activity-time">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reading Progress */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={20} />
              Continue Reading
            </h2>
          </div>
          
          <div className="progress-list">
            {readingProgress.length === 0 ? (
              <div className="empty-state">
                <Clock size={48} strokeWidth={1} />
                <p>No articles in progress</p>
                <Link to="/articles" className="cta-link">
                  Browse Articles
                </Link>
              </div>
            ) : (
              readingProgress.map((item, index) => (
                <Link 
                  key={index} 
                  to={`/articles/${item.articleId}`}
                  className="progress-item"
                >
                  <div className="progress-info">
                    <h4 className="progress-title">{item.articleTitle}</h4>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{item.progress}% complete</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/articles" className="action-card">
            <BookOpen size={24} />
            <span>Browse Articles</span>
          </Link>
          <Link to="/profile?tab=favorites" className="action-card">
            <Heart size={24} />
            <span>My Favorites</span>
          </Link>
          <Link to="/profile?tab=history" className="action-card">
            <Clock size={24} />
            <span>Reading History</span>
          </Link>
          <Link to="/profile?tab=profile" className="action-card">
            <Award size={24} />
            <span>My Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;