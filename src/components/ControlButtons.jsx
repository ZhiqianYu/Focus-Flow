import React from 'react';
import '../styles/ControlButtons.css';
import { useTranslation } from 'react-i18next';

const ControlButtons = ({ 
  isRunning, 
  isPaused, 
  onStartPause, 
  onReset, 
  onOpenSettings 
}) => {

  const { t } = useTranslation();

  return (
    <div className="controls">
      <button 
        className="btn btn-primary" 
        onClick={onStartPause}
      >
        {!isRunning ? (
          <>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
            </svg>
            {t('timer.start')}
          </>
        ) : isPaused ? (
          <>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
            </svg>
            {t('timer.resume')}
          </>
        ) : (
          <>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            {t('timer.pause')}
          </>
        )}
      </button>
      
      <button 
        className="btn btn-secondary" 
        onClick={onReset} 
        disabled={!isRunning}
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
        </svg>
        {t('timer.reset')}
      </button>
    </div>
  );
};

export default ControlButtons;