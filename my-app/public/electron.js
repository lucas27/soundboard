const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const AudioFile = require('../src/scripts/mainFile')


function state(name) {
    switch(name) {
        case 'nodeIntegration':
            return app.isPackaged ? false : true
        case 'webSecurity':
            return app.isPackaged ? false : true
    }
}


const menu = Menu.buildFromTemplate([
    { label: 'Recortar', role: 'cut' },
    { label: 'Copiar', role: 'copy' },
    { label: 'Colar' , role: 'paste' },
    { label: 'Selecionar Tudo', role: 'selectAll' },
    { label: 'Inspecionar Elemento', role: 'toggleDevTools' }
])

const createWindow = () => {

    const win = new BrowserWindow({
        width: 840,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // 1. Desativa a integração com o Node.js no renderer
            nodeIntegration: state('nodeIntegration'), 
            // 2. Isola o contexto do preload (mais seguro)
            contextIsolation: true, 
            // 3. Desativa a segurança para arquivos locais
            webSecurity: state('webSecurity') 
        }
    })
    win.loadURL(
        app.isPackaged  ? `file://${path.join(app.getAppPath(), 'build', 'index.html')}` : "http://localhost:3000" 
    )
    // win.loadURL("http://localhost:3000")
    Menu.setApplicationMenu(null)
    win.webContents.on('context-menu', (event) => {
        menu.popup()
    })
    
    return win
}

 
// forma de chamar a janela
app.on('ready', () => {
    const newWindow = createWindow()
    // app.getAppMetrics()
    ipcMain.handle('toReact', ( async (event) => {
        const fileJson = await AudioFile.getJson()
        return fileJson  
    }) )
    
    ipcMain.handle('audioTemp', (async (event) => {
        return await AudioFile.readStreamFile()
    }))

    ipcMain.on('newImage', (async (event, data, type) => {
        await AudioFile.getImage(data, type)
    }))
    
    ipcMain.on('removeTemp', (async (event, data) => {
        await AudioFile.removeTemp()
        if(data) {
            newWindow.webContents.reload()
        }
    }))

    ipcMain.handle('createWaveForm', (async (event, start, final) => {
        return await AudioFile.createWaveForm(start, final)
    }))
    
    ipcMain.on('reset', ()=> {
        newWindow.webContents.reload()
    })

    ipcMain.on('toMain', async (event, data) => {
        await AudioFile.getUrl(data)
    })

    ipcMain.on('dataBase', (event, start, end, id)=> {
        AudioFile.forDataBase(start, end, id)
    })
    
    ipcMain.handle('fromDB', (event, arg, id) => {
        return AudioFile.selectFiles(arg, id)
    })

    ipcMain.handle('update', (event, id, args) => {
        AudioFile.DeleteFile(id, args)
    })

    ipcMain.on('createAudio', (event, data) => {
        AudioFile.createAudioFile(data)
    })

    ipcMain.on('orderId', (event, oldId, newId) => {
        AudioFile.changeOrderId(oldId, newId)
    })

    ipcMain.on('logger', (event, error) => {
        AudioFile.createLogger(error)
    })

    ipcMain.on('MainDevice', (event) => {
        AudioFile.mainDevice()
    })
    ipcMain.on('changeDevice', (event) => {
        AudioFile.virtualCableDevice()
    })

})

