import React from 'react';
import '../styles/TimerDisplay.css';

const TimerDisplay = ({ 
  mainTime, 
  stageTime, 
  breakTime, 
  status, 
  phase 
}) => {
  return (
    <div className="timer-display">
      <div className="timer-main">{mainTime}</div>
      <div className="timer-status">{status}</div>
      <div className="timer-sub">
        <div className="timer-item">
          <div className="timer-item-label">阶段时间</div>
          <div className="timer-item-time">{stageTime}</div>
        </div>
        <div className="timer-item">
          <div className="timer-item-label">休息时间</div>
          <div className="timer-item-time">{breakTime}</div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;