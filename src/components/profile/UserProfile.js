import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Calendar, Settings, Save, Camera } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/components/UserProfile.css';

const UserProfile = ({ user }) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    preferences: {
      theme: user?.preferences?.theme || 'light',
      notifications: {
        email: user?.preferences?.notifications?.email || true,
        push: user?.preferences?.notifications?.push || false,
      },
      language: user?.preferences?.language || 'en',
      autoSave: user?.preferences?.autoSave || true,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else if (name.includes('notifications.')) {
      const [, notifType] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications: {
            ...prev.preferences.notifications,
            [notifType]: checked,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Profile Settings</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
          <Settings size={16} />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="avatar-section">
          <div className="current-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">{user?.fullName?.charAt(0) || 'U'}</div>
            )}
          </div>
          {isEditing && (
            <button type="button" className="change-avatar-btn">
              <Camera size={16} />
              Change Photo
            </button>
          )}
        </div>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="fullName">
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>
              <Calendar size={16} />
              Member Since
            </label>
            <p className="readonly-field">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>
        {/* <div className="form-section">
          <h3>Preferences</h3>
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="preferences.theme"
              value={formData.preferences.theme}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="preferences.language"
              value={formData.preferences.language}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notifications.email"
                checked={formData.preferences.notifications.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Email Notifications
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notifications.push"
                checked={formData.preferences.notifications.push}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Push Notifications
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="preferences.autoSave"
                checked={formData.preferences.autoSave}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Auto-save Reading Progress
            </label>
          </div>
        </div> */}
        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;