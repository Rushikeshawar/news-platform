import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, AlertCircle, Mail, Clock, Trash2 } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/components/NotificationsList.css'; // Add this CSS file

const NotificationsList = ({ notificationsData, onMarkAsRead, onMarkAllAsRead, isMarkingAsRead }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const notifications = notificationsData?.notifications || [];

  // Filter notifications based on search
  const filteredNotifications = notifications.filter(notification => {
    if (searchQuery === '') return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      notification.title?.toLowerCase().includes(searchLower) ||
      notification.message?.toLowerCase().includes(searchLower)
    );
  });

  const handleMarkAsRead = (notificationId) => {
    onMarkAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric'
    });
  };

  if (notifications.length === 0) {
    return (
      <div className="notifications-list">
        <div className="empty-notifications">
          <Bell size={64} strokeWidth={1} />
          <h3>No notifications yet</h3>
          <p>You'll see updates here when there are new notifications</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-list">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-info">
          <h2 className="notifications-title">
            <Bell size={24} />
            Notifications
          </h2>
          <p className="notifications-count">
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            {notifications.length} total
          </p>
        </div>

        <div className="header-actions">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAsRead || unreadCount === 0}
            className="mark-all-read-btn"
          >
            <CheckCircle size={18} />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Search */}
      {notifications.length > 0 && (
        <div className="notifications-search">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {/* Content */}
      {filteredNotifications.length === 0 ? (
        <div className="empty-notifications">
          <Bell size={64} strokeWidth={1} />
          <h3>No results found</h3>
          <p>Try adjusting your search</p>
          <button onClick={() => setSearchQuery('')} className="reset-btn">
            Clear Search
          </button>
        </div>
      ) : (
        <div className="notifications-grid">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${!notification.isRead ? 'unread' : ''}`}>
              <div className="notification-icon">
                {notification.type === 'error' ? (
                  <AlertCircle size={20} />
                ) : notification.type === 'email' ? (
                  <Mail size={20} />
                ) : (
                  <Bell size={20} />
                )}
              </div>
              <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                {notification.link && (
                  <Link to={notification.link} className="notification-link">
                    View Details
                  </Link>
                )}
                <div className="notification-meta">
                  <span className="notification-time">
                    <Clock size={14} />
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={isMarkingAsRead}
                  className="mark-read-btn"
                >
                  <CheckCircle size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;