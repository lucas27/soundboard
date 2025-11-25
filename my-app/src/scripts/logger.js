const winston = require('winston')
const { app } = require('electron');
const path = require('path');
const fs = require('fs');

// --- 1. DEFINIR O CAMINHO ABSOLUTO E ÚNICO PARA O ARQUIVO DE LOG ---
const logDir = path.join(app.getPath('userData'), 'logs'); // Ex: .../AppData/Roaming/soundBoard/logs
const logFilePath = path.join(logDir, 'runtime_errors.log');

// *Garantir que a pasta de log exista antes de inicializar o Winston*
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// function date() {
//     const date = new Date()
//     return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`
// }

// const timestamp = date()


// const filename = `./data/error_${timestamp}.log`

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: logFilePath, level: 'error', maxsize: 5242880, maxFiles: 5 })
    ]
})

module.exports = logger