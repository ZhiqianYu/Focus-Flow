import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ value, label, sublabel }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        ></div>
      </div>
      <div className="progress-label">
        <span>{label}</span>
        <span>{sublabel || `${Math.round(value)}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;