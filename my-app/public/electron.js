const {app, BrowserWindow, ipcMain, ipcRenderer} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev") 
const AudioFile = require('../downloadAudio')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 840,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // win.loadURL(
    //     isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`
    // )
    win.loadURL("http://localhost:3000")
}


// forma de chamar a janela
app.on('ready', () => {
    createWindow()
    ipcMain.handle('toReact', (event, data) => {
        return AudioFile.thumbnailDoVideo(data)
    })
    
    ipcMain.on('toMain', async (event, data) => {
        const progressListener = (progressData) => {
            event.sender.send('download-progress', progressData)
        }
        AudioFile.emitter.addListener('progress', progressListener)
        await AudioFile.baixarAudioParaBD(data)
        
    })
})

