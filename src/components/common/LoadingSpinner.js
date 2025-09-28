 
import React from 'react';
import { Loader2 } from 'lucide-react';
import '../../styles/components/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = '' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <Loader2 className="spinner-icon" />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;