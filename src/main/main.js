const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const path = require('path');
const fs = require('fs');

// 存储主窗口引用，防止 JavaScript 的垃圾回收机制
let mainWindow = null;
let tray = null;
let isQuitting = false;

// 配置文件路径
const userDataPath = app.getPath('userData');
const configPath = path.join(userDataPath, 'config.json');

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/assets/icons/icon-512.png'),
    show: false // 先不显示窗口，等待加载完成
  });

  // 根据环境加载对应 URL
  const url = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(url);

  // 窗口加载完成后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 关闭窗口事件
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  // 创建托盘图标
  createTray();

  // 开发环境下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// 创建系统托盘图标
function createTray() {
  tray = new Tray(path.join(__dirname, '../public/assets/icons/icon-32.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: '显示 Focus Flow', 
      click: () => mainWindow.show() 
    },
    { 
      label: '开始/暂停', 
      click: () => mainWindow.webContents.send('toggle-timer') 
    },
    { 
      label: '重置', 
      click: () => mainWindow.webContents.send('reset-timer') 
    },
    { type: 'separator' },
    { 
      label: '退出', 
      click: () => {
        isQuitting = true;
        app.quit();
      } 
    }
  ]);
  
  tray.setToolTip('Focus Flow');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

// 应用准备就绪
app.whenReady().then(() => {
  createWindow();
  
  // 在 macOS 上点击 dock 图标时重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

// 所有窗口关闭时退出应用，macOS 除外
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出前
app.on('before-quit', () => {
  isQuitting = true;
});

// IPC 通信处理
ipcMain.handle('load-config', async () => {
  try {
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    }
    return null;
  } catch (error) {
    console.error('读取配置文件失败:', error);
    return null;
  }
});

ipcMain.handle('save-config', async (event, config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存配置文件失败:', error);
    return false;
  }
});