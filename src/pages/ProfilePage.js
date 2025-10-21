import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userService } from '../services/userService';
import UserProfile from '../components/profile/UserProfile';
import ReadingHistory from '../components/profile/ReadingHistory';
import FavoritesList from '../components/profile/FavoritesList';
import NotificationsList from '../components/profile/NotificationsList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { User, Clock, Heart, Settings, Bell } from 'lucide-react';
import '../styles/pages/ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
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
    refetch: refetchFavorites,
  } = useQuery(
    ['user-favorites', user?.id],
    () => userService.getFavorites({ limit: 50 }),
    {
      enabled: isAuthenticated && activeTab === 'favorites',
      staleTime: 2 * 60 * 1000,
      retry: 1,
    }
  );

  // Fetch reading history when on history tab
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery(
    ['reading-history', user?.id],
    () => userService.getReadingHistory({ limit: 50 }),
    {
      enabled: isAuthenticated && activeTab === 'history',
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  );

  // Fetch notifications when on notifications tab
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useQuery(
    ['user-notifications', user?.id],
    () => userService.getNotifications({ limit: 50, unreadOnly: false }),
    {
      enabled: isAuthenticated && activeTab === 'notifications',
      staleTime: 1 * 60 * 1000,
      retry: 1,
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
        alert('Failed to mark notification as read');
      },
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
        alert('Failed to mark all notifications as read');
      },
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
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'history', label: 'Reading History', icon: Clock },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
              <p>Unable to load reading history: {historyError.message}</p>
              <button onClick={() => queryClient.refetchQueries(['reading-history'])}>Retry</button>
            </div>
          );
        }
        return <ReadingHistory historyData={historyData || { readingHistory: [] }} />;
      case 'favorites':
        if (favoritesLoading) return <LoadingSpinner />;
        if (favoritesError) {
          return (
            <div className="error-state">
              <p>Unable to load favorites: {favoritesError.message}</p>
              <button onClick={() => refetchFavorites()}>Retry</button>
            </div>
          );
        }
        return (
          <FavoritesList
            favoritesData={favoritesData || { articles: [] }}
            onRefetch={refetchFavorites}
          />
        );
      case 'notifications':
        if (notificationsLoading) return <LoadingSpinner />;
        if (notificationsError) {
          return (
            <div className="error-state">
              <p>Unable to load notifications: {notificationsError.message}</p>
              <button onClick={() => refetchNotifications()}>Retry</button>
            </div>
          );
        }
        return (
          <NotificationsList
            notificationsData={notificationsData || { notifications: [], unreadCount: 0 }}
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
            <button className="settings-btn" title="Settings" onClick={() => setActiveTab('profile')}>
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button className="notifications-btn" title="Notifications" onClick={() => setActiveTab('notifications')}>
              <Bell size={18} />
              <span>Notifications</span>
            </button>
          </div>
        </div>
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
        <div className="profile-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;