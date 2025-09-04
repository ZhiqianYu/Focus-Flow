import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutButton = ({ onClick, className = '' }) => {
  const { t } = useTranslation();
  
  return (
    <button 
      className={`about-btn ${className}`}
      onClick={onClick}
      style={{
        background: 'transparent',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '8px 16px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        color: '#666',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#f5f5f5';
        e.target.style.borderColor = '#999';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent';
        e.target.style.borderColor = '#ccc';
      }}
    >
      {t('footer.about')}
    </button>
  );
};

export default AboutButton;