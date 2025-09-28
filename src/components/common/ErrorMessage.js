 
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import '../../styles/components/ErrorMessage.css';

const ErrorMessage = ({ message, onRetry, showRetry = true }) => {
  return (
    <div className="error-message">
      <div className="error-content">
        <AlertCircle className="error-icon" size={24} />
        <div className="error-text">
          <h3>Something went wrong</h3>
          <p>{message || 'An unexpected error occurred'}</p>
        </div>
        {showRetry && onRetry && (
          <button onClick={onRetry} className="retry-btn">
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;