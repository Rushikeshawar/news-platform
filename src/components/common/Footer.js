// src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#1a202c',
      color: 'white',
      padding: '3rem 2rem 1rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Lines</h3>
            <p>Your gateway to staying informed</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/articles" style={{ color: '#a0aec0', textDecoration: 'none' }}>Articles</Link>
              <Link to="/ai-ml" style={{ color: '#a0aec0', textDecoration: 'none' }}>AI/ML</Link>
              <Link to="/time-saver" style={{ color: '#a0aec0', textDecoration: 'none' }}>Time Saver</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Github size={20} />
              <Twitter size={20} />
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #2d3748',
          paddingTop: '1rem',
          textAlign: 'center'
        }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Made with <Heart size={16} /> for news enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

