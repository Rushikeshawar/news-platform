 
// src/components/profile/UserDashboard.js
import React from 'react';
import { useQuery } from 'react-query';
import { userService } from '../../services/userService';
import { 
  Eye, 
  Heart, 
  Clock, 
  TrendingUp, 
  BookOpen,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const UserDashboard = ({ user, dashboardData }) => {
  const { data: favoritesStats } = useQuery(
    'favorites-stats',
    () => userService.getFavoritesStats(),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: notificationsCount } = useQuery(
    'unread-notifications',
    () => userService.getUnreadNotificationsCount(),
    { 
      staleTime: 1 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000
    }
  );

  if (!dashboardData) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const stats = [
    {
      label: 'Articles Read',
      value: dashboardData?.articlesRead || 0,
      icon: Eye,
      color: 'blue'
    },
    {
      label: 'Favorites',
      value: favoritesStats?.data?.totalFavorites || 0,
      icon: Heart,
      color: 'red'
    },
    {
      label: 'Reading Time',
      value: `${Math.round((dashboardData?.totalReadingTime || 0) / 60)}h`,
      icon: Clock,
      color: 'green'
    },
    {
      label: 'Streak Days',
      value: dashboardData?.streakDays || 0,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>Your Dashboard</h2>
        <p>Track your reading progress and preferences</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div className="stat-icon">
              <Icon size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{value}</h3>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {dashboardData?.recentActivity?.length > 0 ? (
            dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <BookOpen size={16} />
                <span>{activity.description}</span>
                <span className="activity-time">
                  <Calendar size={12} />
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p>No recent activity</p>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notificationsCount?.data?.count > 0 && (
        <div className="notifications-summary">
          <h3>Notifications</h3>
          <p>You have {notificationsCount.data.count} unread notifications</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

