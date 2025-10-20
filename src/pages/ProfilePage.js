import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userService } from '../services/userService';
import UserProfile from '../components/profile/UserProfile';
import ReadingHistory from '../components/profile/ReadingHistory';
import FavoritesList from '../components/profile/FavoritesList';
import NotificationsList from '../components/profile/NotificationsList'; // New component
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  User, 
  Clock, 
  Heart,
  Settings,
  Bell
} from 'lucide-react';
import '../styles/pages/ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // Default to profile
  const queryClient = useQueryClient();

  // Get tab from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['profile', 'history', 'favorites', 'notifications'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Fetch favorites when on favorites tab
  const { 
    data: favoritesData, 
    isLoading: favoritesLoading,
    error: favoritesError,
    refetch: refetchFavorites
  } = useQuery(
    ['user-favorites', user?.id],
    () => userService.getFavorites({ limit: 50 }),
    { 
      enabled: isAuthenticated && activeTab === 'favorites',
      staleTime: 2 * 60 * 1000,
      retry: 1
    }
  );

  // Fetch reading history when on history tab
  const { 
    data: historyData, 
    isLoading: historyLoading,
    error: historyError 
  } = useQuery(
    ['reading-history', user?.id],
    () => userService.getReadingHistory({ limit: 50 }),
    { 
      enabled: isAuthenticated && activeTab === 'history',
      staleTime: 5 * 60 * 1000,
      retry: 1
    }
  );

  // Fetch notifications when on notifications tab
  const { 
    data: notificationsData, 
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications
  } = useQuery(
    ['user-notifications', user?.id],
    () => userService.getNotifications({ limit: 50, unreadOnly: false }),
    { 
      enabled: isAuthenticated && activeTab === 'notifications',
      staleTime: 1 * 60 * 1000,
      retry: 1
    }
  );

  // Mutation for marking notification as read
  const markAsReadMutation = useMutation(
    (notificationId) => userService.markNotificationAsRead(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-notifications']);
      },
      onError: (error) => {
        console.error('Error marking notification as read:', error);
      }
    }
  );

  // Mutation for marking all as read
  const markAllAsReadMutation = useMutation(
    () => userService.markAllNotificationsAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-notifications']);
      },
      onError: (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    }
  );

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2>Please login to view your profile</h2>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User
    },
    {
      id: 'history',
      label: 'Reading History',
      icon: Clock
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile user={user} />;

      case 'history':
        if (historyLoading) return <LoadingSpinner />;
        if (historyError) {
          return (
            <div className="error-state">
              <p>Unable to load reading history.</p>
            </div>
          );
        }
        return (
          <ReadingHistory 
            historyData={historyData?.data || { history: [] }}
          />
        );

      case 'favorites':
        if (favoritesError) {
          return (
            <div className="error-state">
              <p>Unable to load favorites. Please try again.</p>
              <button onClick={() => refetchFavorites()}>Retry</button>
            </div>
          );
        }
        // Always render, even if empty
        const safeFavoritesData = favoritesData?.data || { favorites: [] };
        return (
          <FavoritesList 
            favoritesData={safeFavoritesData}
            onRefetch={refetchFavorites}
          />
        );

      case 'notifications':
        if (notificationsLoading) return <LoadingSpinner />;
        if (notificationsError) {
          return (
            <div className="error-state">
              <p>Unable to load notifications.</p>
              <button onClick={() => refetchNotifications()}>Retry</button>
            </div>
          );
        }
        return (
          <NotificationsList 
            notificationsData={notificationsData?.data || { notifications: [] }}
            onMarkAsRead={markAsReadMutation.mutate}
            onMarkAllAsRead={markAllAsReadMutation.mutate}
            isMarkingAsRead={markAsReadMutation.isLoading || markAllAsReadMutation.isLoading}
          />
        );

      default:
        return <UserProfile user={user} />;
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="user-details">
              <h1 className="user-name">{user?.fullName || 'User'}</h1>
              <p className="user-email">{user?.email}</p>
              <p className="user-role">
                <span className="role-badge">{user?.role || 'USER'}</span>
              </p>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="settings-btn" title="Settings">
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button className="notifications-btn" title="Notifications" onClick={() => setActiveTab('notifications')}>
              <Bell size={18} />
              <span>Notifications</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-nav">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;