// src/components/common/Header.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  LogOut, 
  Sun, 
  Moon,
  Home,
  FileText,
  Brain,
  Clock
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/articles', label: 'Articles', icon: FileText },
    { path: '/ai-ml', label: 'AI/ML', icon: Brain },
    { path: '/time-saver', label: 'Time Saver', icon: Clock }
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      zIndex: 1000,
      padding: '1rem 2rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: '#3182ce', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Lines
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                color: isActiveRoute(path) ? '#3182ce' : '#4a5568',
                textDecoration: 'none',
                borderRadius: '8px',
                backgroundColor: isActiveRoute(path) ? '#f7fafc' : 'transparent'
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f7fafc'
              }}
            />
          </div>
        </form>

        {/* Theme Toggle & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link 
                to="/profile" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  color: '#4a5568'
                }}
              >
                <User size={20} />
                <span>{user?.fullName || 'Profile'}</span>
              </Link>
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link 
                to="/login" 
                style={{
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  color: '#4a5568',
                  borderRadius: '8px'
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3182ce',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px'
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

