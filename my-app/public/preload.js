const { contextBridge, ipcRenderer } = require('electron')


const WINDOW_API = {
    startDownload: (channel, data) => ipcRenderer.send(channel, data),
    getThumbnailUrl: (channel, data) => ipcRenderer.invoke(channel, data),
    receive: (channel, func) => {
        ipcRenderer.addListener(channel, (event, ...args) => func(...args));
    }
}

contextBridge.exposeInMainWorld("api", WINDOW_API)