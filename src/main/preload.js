const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 加载配置
  loadConfig: () => ipcRenderer.invoke('load-config'),
  
  // 保存配置
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  
  // 监听主进程发来的消息
  onToggleTimer: (callback) => ipcRenderer.on('toggle-timer', callback),
  onResetTimer: (callback) => ipcRenderer.on('reset-timer', callback),
  
  // 移除事件监听
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});