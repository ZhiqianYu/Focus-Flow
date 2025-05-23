const { app, BrowserWindow, Menu, Tray, globalShortcut, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;
let isQuitting = false;

// 配置文件路径
const userDataPath = app.getPath('userData');
const configPath = path.join(userDataPath, 'config.json');

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'Focus Flow - 智能学习计时器',
    center: true,
    backgroundColor: '#667eea'
  });

  // 加载应用
  mainWindow.loadFile('index.html');

  // 窗口关闭时的处理
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 创建系统托盘
function createTray() {
  const iconPath = path.join(__dirname, 'assets/tray-icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: '开始/暂停',
      accelerator: 'CmdOrCtrl+Space',
      click: () => {
        mainWindow.webContents.send('toggle-timer');
      }
    },
    { type: 'separator' },
    {
      label: '设置',
      click: () => {
        mainWindow.webContents.send('open-settings');
      }
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

  tray.setToolTip('Focus Flow - 智能学习计时器');
  tray.setContextMenu(contextMenu);

  // 双击托盘图标显示窗口
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// 注册全局快捷键
function registerShortcuts() {
  // 全局开始/暂停快捷键
  globalShortcut.register('CmdOrCtrl+Shift+Space', () => {
    mainWindow.webContents.send('toggle-timer');
  });

  // 全局重置快捷键
  globalShortcut.register('CmdOrCtrl+Shift+R', () => {
    mainWindow.webContents.send('reset-timer');
  });
}

// 应用准备就绪
app.whenReady().then(() => {
  createWindow();
  createTray();
  registerShortcuts();

  // 创建应用菜单
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '导入配置',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              filters: [
                { name: 'JSON Files', extensions: ['json'] }
              ]
            });
            
            if (!result.canceled) {
              const configData = fs.readFileSync(result.filePaths[0], 'utf8');
              mainWindow.webContents.send('import-config', configData);
            }
          }
        },
        {
          label: '导出配置',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              defaultPath: 'focus-flow-config.json',
              filters: [
                { name: 'JSON Files', extensions: ['json'] }
              ]
            });
            
            if (!result.canceled) {
              mainWindow.webContents.send('export-config', result.filePath);
            }
          }
        },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 Focus Flow',
              message: 'Focus Flow - 智能学习计时器',
              detail: '版本: 1.0.0\n作者: Zhiqian Yu\n\n基于神经科学原理的学习辅助工具',
              buttons: ['确定']
            });
          }
        },
        {
          label: '使用说明',
          click: () => {
            mainWindow.webContents.send('show-instructions');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

// 处理音频文件读取
ipcMain.handle('get-audio-files', async () => {
  const audioPath = path.join(app.getPath('userData'), 'audio');
  
  // 确保音频目录存在
  if (!fs.existsSync(audioPath)) {
    fs.mkdirSync(audioPath, { recursive: true });
    fs.mkdirSync(path.join(audioPath, 'notis'), { recursive: true });
    fs.mkdirSync(path.join(audioPath, 'pause'), { recursive: true });
  }

  const notisFiles = fs.readdirSync(path.join(audioPath, 'notis'))
    .filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));
  
  const pauseFiles = fs.readdirSync(path.join(audioPath, 'pause'))
    .filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));

  return {
    notis: notisFiles,
    pause: pauseFiles
  };
});

// 保存配置
ipcMain.handle('save-config', async (event, config) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 加载配置
ipcMain.handle('load-config', async () => {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('加载配置失败:', error);
    return null;
  }
});

// 应用退出时的清理
app.on('before-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});