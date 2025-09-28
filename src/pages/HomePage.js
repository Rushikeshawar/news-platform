 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { articlesService } from '../services/articlesService';
import { aiMlService } from '../services/aiMlService';
import { timeSaverService } from '../services/timeSaverService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ArticleCard from '../components/articles/ArticleCard';
import AiMlCard from '../components/ai-ml/AiMlCard';
import TimeSaverCard from '../components/time-saver/TimeSaverCard';
import { TrendingUp, FileText, Brain, Clock, ArrowRight } from 'lucide-react';
import '../styles/pages/HomePage.css';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('articles');

  // Fetch data for home page
  const { data: articlesData, isLoading: articlesLoading } = useQuery(
    'trending-articles',
    () => articlesService.getTrendingArticles({ limit: 6 }),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: aiMlData, isLoading: aiMlLoading } = useQuery(
    'trending-aiml',
    () => aiMlService.getTrendingAiMl({ limit: 6 }),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: timeSaverData, isLoading: timeSaverLoading } = useQuery(
    'timesaver-stats',
    () => timeSaverService.getStats(),
    { staleTime: 5 * 60 * 1000 }
  );

  const sections = [
    {
      id: 'articles',
      title: 'Latest Articles',
      icon: FileText,
      data: articlesData?.data?.articles || [],
      loading: articlesLoading,
      link: '/articles',
      color: 'blue'
    },
    {
      id: 'aiml',
      title: 'AI/ML News',
      icon: Brain,
      data: aiMlData?.data?.articles || [],
      loading: aiMlLoading,
      link: '/ai-ml',
      color: 'purple'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Stay Informed with <span className="highlight">NewsHub</span>
            </h1>
            <p className="hero-description">
              Discover the latest articles, AI/ML innovations, and time-saving content 
              all in one place. Your gateway to staying informed and ahead of the curve.
            </p>
            <div className="hero-actions">
              <Link to="/articles" className="hero-btn primary">
                Explore Articles
              </Link>
              <Link to="/ai-ml" className="hero-btn secondary">
                AI/ML News
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <TrendingUp className="stat-icon" />
              <div className="stat-content">
                <h3>Latest</h3>
                <p>Breaking News</p>
              </div>
            </div>
            <div className="stat-card">
              <Brain className="stat-icon" />
              <div className="stat-content">
                <h3>AI/ML</h3>
                <p>Innovations</p>
              </div>
            </div>
            <div className="stat-card">
              <Clock className="stat-icon" />
              <div className="stat-content">
                <h3>Time Saver</h3>
                <p>Quick Reads</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="quick-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>{timeSaverData?.data?.stats?.storiesCount || 0}</h3>
              <p>Stories Today</p>
            </div>
            <div className="stat-item">
              <h3>{timeSaverData?.data?.stats?.updatesCount || 0}</h3>
              <p>Updates</p>
            </div>
            <div className="stat-item">
              <h3>{timeSaverData?.data?.stats?.breakingCount || 0}</h3>
              <p>Breaking News</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-sections">
        <div className="container">
          {/* Section Navigation */}
          <div className="section-nav">
            {sections.map(({ id, title, icon: Icon, color }) => (
              <button
                key={id}
                className={`section-nav-btn ${activeSection === id ? 'active' : ''} ${color}`}
                onClick={() => setActiveSection(id)}
              >
                <Icon size={20} />
                <span>{title}</span>
              </button>
            ))}
          </div>

          {/* Content Display */}
          {sections.map(({ id, title, data, loading, link, icon: Icon }) => (
            <div
              key={id}
              className={`content-section ${activeSection === id ? 'active' : ''}`}
            >
              <div className="section-header">
                <h2 className="section-title">
                  <Icon size={24} />
                  {title}
                </h2>
                <Link to={link} className="view-all-link">
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="content-grid">
                  {data.slice(0, 6).map((item) => {
                    if (id === 'articles') {
                      return <ArticleCard key={item.id} article={item} />;
                    } else if (id === 'aiml') {
                      return <AiMlCard key={item.id} article={item} />;
                    }
                    return null;
                  })}
                </div>
              )}

              {!loading && data.length === 0 && (
                <div className="no-content">
                  <p>No content available at the moment.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Time Saver Preview */}
      <section className="time-saver-preview">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={24} />
              Time Saver Content
            </h2>
            <Link to="/time-saver" className="view-all-link">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          
          {timeSaverLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="time-saver-stats">
              <div className="time-stat-card">
                <h3>Today's New</h3>
                <p className="stat-number">{timeSaverData?.data?.stats?.todayNewCount || 0}</p>
                <span className="stat-label">Fresh content</span>
              </div>
              <div className="time-stat-card">
                <h3>Breaking & Critical</h3>
                <p className="stat-number">{timeSaverData?.data?.stats?.criticalCount || 0}</p>
                <span className="stat-label">Priority updates</span>
              </div>
              <div className="time-stat-card">
                <h3>Weekly Highlights</h3>
                <p className="stat-number">{timeSaverData?.data?.stats?.weeklyCount || 0}</p>
                <span className="stat-label">Top stories</span>
              </div>
              <div className="time-stat-card">
                <h3>Viral & Buzz</h3>
                <p className="stat-number">{timeSaverData?.data?.stats?.viralBuzzCount || 0}</p>
                <span className="stat-label">Trending now</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Dive Deeper?</h2>
            <p>
              Explore our comprehensive collection of articles, AI/ML insights, 
              and time-saving content to stay ahead of the curve.
            </p>
            <div className="cta-buttons">
              <Link to="/articles" className="cta-btn primary">
                Browse Articles
              </Link>
              <Link to="/ai-ml" className="cta-btn secondary">
                AI/ML News
              </Link>
              <Link to="/time-saver" className="cta-btn secondary">
                Time Saver
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;