const {app, BrowserWindow} = require('electron')
const {spawn, exec} = require('child_process')
const { path } = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadFile('./public/index.html')
}

// forma de chamar a janela
app.on('ready', () => {
    createWindow()
})

