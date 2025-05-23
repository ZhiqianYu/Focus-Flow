const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true
    }
  });

  const startURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : 'file://' + path.join(__dirname, '../../public/index.html');

  win.loadURL(startURL);
}

app.whenReady().then(createWindow);
