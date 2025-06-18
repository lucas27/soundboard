const { contextBridge, ipcRenderer } = require('electron')

const WINDOW_API = {
    startDownload: (channel, data) => ipcRenderer.send(channel, data),
    getJsonFile: (channel) => ipcRenderer.invoke(channel),
    tempAudioFile: (channel) => ipcRenderer.invoke(channel),
    waveForm: (channel, start, final) => ipcRenderer.invoke(channel, start, final),
    removeFile: (channel, data) => ipcRenderer.send(channel, data),
    getNewImage: (channel, data, type) => ipcRenderer.send(channel, data, type),
    resetPage: (channel) => ipcRenderer.send(channel),
    forDataBase: (channel, start, end, id) => ipcRenderer.send(channel, start, end, id),
    selectFilesFromDB: (channel,arg, id) => ipcRenderer.invoke(channel, arg, id),
    deleteFileFromDB: (channel, id, args) => ipcRenderer.invoke(channel, id, args),
    createAudioFile: (channel, data) => ipcRenderer.send(channel, data),
    changeOrderId: (channel, oldId, newId) => ipcRenderer.send(channel, oldId, newId),
    errorLogger: (channel, error) => ipcRenderer.send(channel, error),
    MainDevice: (channel) => ipcRenderer.send(channel),
    virtualCableDevice: (channel) => ipcRenderer.send(channel)
}

contextBridge.exposeInMainWorld("api", WINDOW_API)