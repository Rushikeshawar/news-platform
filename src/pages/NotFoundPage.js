 
// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn primary">
              <Home size={18} />
              Go Home
            </Link>
            <button onClick={() => window.history.back()} className="btn secondary">
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

