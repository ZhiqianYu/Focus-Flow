import React, { useState } from 'react';
import '../styles/DonateButton.css';
import { useTranslation } from 'react-i18next';
import wechatQR from '../assets/donate/wechat.png';
import alipayQR from '../assets/donate/alipay.jpg';
import paypalButton from '../assets/donate/paypal.png';

const DonateButton = () => {
  const { t } = useTranslation();

  const [showDonateOptions, setShowDonateOptions] = useState(false);
  
  return (
    <div className="donate-container">
      <button 
        className="donate-button"
        onClick={() => setShowDonateOptions(true)}
        aria-label="捐赠支持开发者"
      >
        {t('donate.button')}
      </button>
      
      {showDonateOptions && (
        <div className="donate-modal">
          <div className="donate-modal-content">
            <button 
              className="close-donate-modal"
              onClick={() => setShowDonateOptions(false)}
            >
              ×
            </button>
            
            <h3>{t('donate.title')}</h3>
            <p>{t('donate.message')}</p>
            
            <div className="payment-options">
              <h4>{t('donate.paymentOptions')}：</h4>
              
              <div className="payment-grid">
                {/* PayPal */}
                <a 
                  href="https://www.paypal.me/ZhiqianY" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="paypal-button"
                >
                  <img
                    src={paypalButton} 
                    alt="PayPal 捐赠" 
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '50px' }} 
                  />
                </a>
                {/* Buy Me a Coffee */}
                <a 
                  href="https://buymeacoffee.com/zhiqiany" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="buymeacoffee-button"
                >
                  <img 
                    src="https://img.buymeacoffee.com/button-api/?text=Buy me an Ice&emoji=🍧&slug=zhiqiany&button_colour=5F7FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" 
                    alt="Buy me an Ice" 
                    style={{ maxWidth: '240px', height: 'auto', maxHeight: '50px' }} 
                  />
                </a>
              </div>
              
              <div className="qr-codes">
                <div className="qr-code-item">
                  <h5>{t('donate.wechat')}</h5>
                  <div className="qr-placeholder">
                    <img src={wechatQR} alt="微信支付" style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>
                <div className="qr-code-item">
                  <h5>{t('donate.alipay')}</h5>
                  <div className="qr-placeholder">
                    <img src={alipayQR} alt="支付宝支付" style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateButton;