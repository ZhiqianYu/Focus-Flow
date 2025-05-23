import React, { useState } from 'react';
import '../styles/DonateButton.css';

const DonateButton = () => {
  const [showDonateOptions, setShowDonateOptions] = useState(false);
  
  return (
    <div className="donate-container">
      <button 
        className="donate-button"
        onClick={() => setShowDonateOptions(true)}
        aria-label="打赏支持开发者"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v1H4V4zm0 3h12v10H4V7z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        请我喝杯咖啡
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
            
            <h3>感谢您的支持！</h3>
            <p>您的打赏将帮助我继续改进Focus Flow，并开发更多有用的工具。</p>
            
            <div className="payment-options">
              <h4>请选择支付方式：</h4>
              
              <div className="payment-grid">
                {/* PayPal */}
                <a 
                  href="https://www.paypal.me/你的PayPal用户名" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="payment-option"
                >
                  <div className="payment-icon paypal-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#003087" d="M20.067 8.478c.492.876.663 1.895.458 2.887-.687 3.327-3.781 4.295-7.593 4.295H11.1l-.724 3.436H7.154L8.986 7h6.136c1.893 0 3.683.596 4.945 1.478z" />
                      <path fill="#003087" d="M19.65 2H13.34a.524.524 0 00-.517.429l-2.87 13.586a.516.516 0 00.516.599h3.19a.72.72 0 00.71-.599l.656-3.11h2.755c3.812 0 7.174-.99 7.93-4.559A5.064 5.064 0 0024 4.478C22.738 2.875 21.094 2 19.65 2z" />
                    </svg>
                  </div>
                  <span>PayPal</span>
                </a>
                
                {/* 微信支付 */}
                <button className="payment-option" onClick={() => alert('请扫描二维码使用微信支付')}>
                  <div className="payment-icon wechat-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#07C160" d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.5c.89.31 1.87.5 2.92.5A5.55 5.55 0 0114 14.89V10c0-3.31-3.36-6-7.5-6zm0 1.5c2.99 0 5.5 2.01 5.5 4.5s-2.51 4.5-5.5 4.5c-1.22 0-2.4-.31-3.4-.89L4 15l.75-2.06c-.99-.82-1.61-1.95-1.61-3.22 0-2.49 2.51-4.5 5.5-4.5zM16.5 8c-.17 0-.34.01-.5.03V14c0 3.31-3.36 6-7.5 6-.79 0-1.56-.11-2.28-.3L2.5 21l.5-2.5c-1.32-1.1-2-2.57-2-4.08V14c0-1.95 1.08-3.66 2.78-4.77-.05-.37-.07-.76-.07-1.15 0-1.86.93-3.5 2.41-4.73C5.38 2.4 4.72 2 4 2 2.34 2 1 3.34 1 5c0 .97.47 1.84 1.2 2.39A7.506 7.506 0 000 12.5c0 1.89 1.08 3.56 2.78 4.66L2 20l3.5-2c.92.31 1.92.5 3 .5 4.14 0 7.5-2.69 7.5-6v-3c0-.82-.67-1.5-1.5-1.5z" />
                    </svg>
                  </div>
                  <span>微信支付</span>
                </button>
                
                {/* 支付宝 */}
                <button className="payment-option" onClick={() => alert('请扫描二维码使用支付宝')}>
                  <div className="payment-icon alipay-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#1677FF" d="M23.6 11.9c-.4-.5-1.2-.5-2.3-.5h-8.5c.6-2.1 1.2-4.9 1.2-7.1 0-1.9-.9-2.9-2.7-2.9-3.2 0-4.1 3.4-4.1 3.9l-2.3 7H2.4c-.8 0-1.4.6-1.4 1.4v7.9c0 .8.6 1.4 1.4 1.4h17.2c1.9 0 3.4-1.5 3.4-3.4 0-1.7-.1-3.8-.2-5.7-.1-1.2-.5-1.5-1.2-2zM5.3 20H2.4c-.3 0-.5-.2-.5-.5v-7.9c0-.3.2-.5.5-.5h2.9v8.9zm15.5-1.6c0 1.3-1.1 2.4-2.4 2.4H6.1v-8.9h8.8c1.1 0 2.1.1 2.6.7.4.5.6 1.1.6 2.1.1 1.9.1 3.9.1 5.6 0 .3.3.5.6.5.3 0 .5-.2.5-.5 0-1.1 0-3.3-.1-5.6 0-.7-.1-1.3-.2-1.7h3.9c.7 0 1 0 1.1.2.3.3.5 1.2.6 2.1.1 1.9.2 4 .2 5.7 0 .3.2.5.5.5.3 0 .5-.2.5-.5 0-1.7-.1-3.8-.2-5.7-.1-1-.3-2.2-.9-2.7-.4-.2-1-.3-2-.3h-3.2c-.5-1.3-1.6-3.1-3.3-3.1-.7 0-1.1.3-1.1.8 0 1.7-.5 4.4-1.2 6.3L9.5 12.2H6.1V8c0-1.2.5-4.8 3.1-4.8 1.2 0 1.8.5 1.8 2 0 2.1-.6 4.9-1.2 6.9h11.2c.6 0 .9 0 1 .1.2.3.5.8.6 1.6.1 1.9.2 4.1.2 5.8z" />
                    </svg>
                  </div>
                  <span>支付宝</span>
                </button>
                
                {/* 信用卡 */}
                <a 
                  href="https://buymeacoffee.com/你的用户名" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="payment-option"
                >
                  <div className="payment-icon card-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#6366f1" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                    </svg>
                  </div>
                  <span>信用卡</span>
                </a>
              </div>
              
              <div className="qr-codes">
                <div className="qr-code-item">
                  <h5>微信支付</h5>
                  <div className="qr-placeholder">
                    {/* 替换为你的微信支付二维码图片 */}
                    <div className="placeholder-text">微信支付二维码</div>
                  </div>
                </div>
                <div className="qr-code-item">
                  <h5>支付宝</h5>
                  <div className="qr-placeholder">
                    {/* 替换为你的支付宝二维码图片 */}
                    <div className="placeholder-text">支付宝二维码</div>
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