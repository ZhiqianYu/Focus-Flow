import React from 'react';
import '../styles/InstallButton.css';
import { useTranslation } from 'react-i18next';

const InstallButton = ({ isInstallable, promptInstall }) => {
  const { t } = useTranslation();

  if (!isInstallable) return null;
  
  return (
    <div className="install-container">
      <button className="install-button" onClick={promptInstall}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
        {t('install.button')}
      </button>
    </div>
  );
};

export default InstallButton;