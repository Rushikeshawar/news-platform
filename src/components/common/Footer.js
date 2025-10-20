

import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, FileText, Brain, Clock } from 'lucide-react';
import LinesLogo from './LinesLogo';
import '../../styles/components/footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <nav className="footer-nav">
          <Link to="/" aria-label="Lines Home" className="footer-link logo-link">
            <LinesLogo height={24} animated={false} theme="light" />
          </Link>
          <Link to="/articles" className="footer-link" aria-label="Articles">
            <FileText size={20} />
          </Link>
          <Link to="/ai-ml" className="footer-link" aria-label="AI/ML">
            <Brain size={20} />
          </Link>
          <Link to="/time-saver" className="footer-link" aria-label="Time Saver">
            <Clock size={20} />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
        </nav>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Lines. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;