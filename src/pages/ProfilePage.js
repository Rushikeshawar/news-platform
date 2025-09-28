 
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'react-query';
import { userService } from '../services/userService';
import UserProfile from '../components/profile/UserProfile';
import UserDashboard from '../components/profile/UserDashboard';
import ReadingHistory from '../components/profile/ReadingHistory';
import FavoritesList from '../components/profile/FavoritesList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  User, 
  BarChart3, 
  Clock, 
  Heart,
  Settings,
  Bell
} from 'lucide-react';
import '../styles/pages/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch user dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(
    'user-dashboard',
    () => userService.getUserDashboard(),
    { staleTime: 5 * 60 * 1000 }
  );

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      component: UserDashboard
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      component: UserProfile
    },
    {
      id: 'history',
      label: 'Reading History',
      icon: Clock,
      component: ReadingHistory
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      component: FavoritesList
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || UserDashboard;

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
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="user-details">
              <h1 className="user-name">{user?.fullName || 'User'}</h1>
              <p className="user-email">{user?.email}</p>
              <p className="user-role">Role: {user?.role || 'USER'}</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="settings-btn">
              <Settings size={18} />
              Settings
            </button>
            <button className="notifications-btn">
              <Bell size={18} />
              Notifications
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
          {dashboardLoading && activeTab === 'dashboard' ? (
            <LoadingSpinner />
          ) : (
            <ActiveComponent 
              user={user} 
              dashboardData={dashboardData?.data}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;