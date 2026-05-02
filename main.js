const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Unity Dashboard",
    icon: path.join(__dirname, 'assets/unity-logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

ipcMain.handle('save-file', async (event, options) => {
  const { content, fileName, path: defaultPath, filters } = options;
  const { filePath, canceled } = await dialog.showSaveDialog({
    defaultPath: defaultPath ? path.join(defaultPath, fileName) : fileName,
    filters
  });

  if (canceled) return { cancelled: true };

  try {
    fs.writeFileSync(filePath, Buffer.from(content, 'base64'));
    return { cancelled: false, path: path.dirname(filePath) };
  } catch (err) {
    console.error('Save error:', err);
    return { cancelled: true, error: err.message };
  }
});

ipcMain.handle('open-file', async (event, filePath) => {
  const { shell } = require('electron');
  shell.openPath(filePath);
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
