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
import LinesLogo from './LinesLogo'; // Ensure this file exists
import '../../styles/components/Header.css';

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
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
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
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" aria-label="Lines Home">
            <LinesLogo height={40} animated={true} theme={theme} className="header-logo" />
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div></div>
          <div></div>
          <div></div>
        </button>

        {/* Navigation and Search Container */}
        <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
          {/* Desktop and Mobile Navigation */}
          <nav className="nav-links">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={isActiveRoute(path) ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Theme Toggle & User Menu */}
        <div className="auth-container">
          {/* <button
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button> */}

          {isAuthenticated ? (
            <div className="auth-links">
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <User size={20} />
                <span>{user?.fullName || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
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