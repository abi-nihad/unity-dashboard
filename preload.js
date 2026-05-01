const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  openFile: (path) => ipcRenderer.invoke('open-file', path),
});
