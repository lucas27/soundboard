const {spawn} = require('child_process')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const { Writable } = require('stream')
const DB = require('../../dataBase/dataBase.js')
const logger = require('./logger.js')
const { app } = require('electron')
const path = require('path')
const { keyboard, Key } = require('@nut-tree-fork/nut-js')

const dirData = path.join(app.getPath('temp'), 'data')
const pathToFfmpeg = app.isPackaged ? path.join(process.resourcesPath, 'ffmpeg-7.1.1-full_build', 'bin', 'ffmpeg.exe') : 'C:/ffmpeg-7.1.1-full_build/bin/ffmpeg.exe'
ffmpeg.setFfmpegPath(pathToFfmpeg);
keyboard.config.autoDelayMs = 0 


if(!fs.existsSync(dirData) && app.isPackaged) {
  fs.mkdirSync(dirData)
  const hotKeyFile = {
    "MainDevice": ["LeftControl", "LeftShift", "I"],
    "VirtualDevice": ["LeftControl", "LeftShift", "P"]
  }
  fs.writeFileSync(path.join(app.getPath('userData'), 'hotKeyFile.txt') , JSON.stringify(hotKeyFile, null, 2))
}


function imageFile(typeFile) {
  let fileImage
  
  if(app.isPackaged) {
    fileImage = path.join(app.getPath('temp'), 'data', `imagem.${typeFile}`)
  }else {
    fileImage = `.data/imagem.${typeFile}`
  }
  return fileImage
}

const fileTempJson = app.isPackaged ? path.join(app.getPath('temp'), 'data', 'temp.json') : './data/temp.json'
const fileTempMp4 = app.isPackaged ? path.join(app.getPath('temp'), 'data', 'temp.mp4') : './data/temp.mp4'


function getUrl(url) {
  let child;
  
  if (app.isPackaged) {
    // MODO PRODUÇÃO: Chamar o executável compilado
    const execPath = path.join(process.resourcesPath, 'downloader', 'downloader.exe');
    child = spawn(execPath, []);
    console.log(`Produção: Executando ${execPath}`);
      
  } else {
      // MODO DESENVOLVIMENTO: Chamar o interpretador 'python' e passar o caminho do script
      const scriptPath = path.join(__dirname, '..', 'scripts', 'downloader.py');
      child = spawn('python', [scriptPath]);
      console.log(`Desenvolvimento: Executando python ${scriptPath}`);
  } 
  
  /* o stdin envia a url */
  child.stdin.write(url)
  child.stdin.end();
  
}

// getUrl('https://youtube.com/watch?v=AYJ3VzD3ilo')

function readStreamFile() {
  try {
    return fs.readFileSync(fileTempMp4, (err) => err)  

  }catch (err) {
    logger.error(err)
  }
}

function removeTemp() {
  try {
    if(fs.existsSync(fileTempJson)){
      fs.unlinkSync(fileTempJson)
      fs.unlinkSync(fileTempMp4)
    } else if(fs.existsSync(fileTempMp4)) {
      fs.unlinkSync(fileTempMp4)
    } else {
      console.log('nada para apagar')
    }
    console.log('arquivos temporarios apagados')
  
    const type = ['jpeg', 'jpg', 'png']
    const files = fs.readdirSync(dirData)
    for(let i = 0; i <= type.length - 1; i++) {
      const imageTemp = imageFile(type[i])
      if(files.includes(imageTemp)) {
        if(fs.existsSync(imageTemp)){
          fs.unlinkSync(imageTemp) 
          console.log('imagem temporaria deletada')
        }
      }
    }
  }catch (err) {
    logger.error(err)
  }
}

function getImage(data, type) {
  try {
    fs.writeFileSync(imageFile(type.split('/')[1]), Buffer.from(data))
    const readJson = fs.readFileSync(fileTempJson)
    const jsonFile = JSON.parse(readJson)
    jsonFile.thumbnailMimetype = type
    const file = JSON.stringify(jsonFile, null, 2)
    fs.writeFileSync(fileTempJson, file)
  }catch (err) {
    logger.error(err)
  }
}

async function getJson() {
  try {
    const fileInString = await fs.readFileSync(fileTempJson, 'utf-8')
    return await JSON.parse(fileInString)

  }catch (err) {
    logger.error(err)
  }
}

function createWaveForm(startValue, finalValue) {
  return new Promise((resolve) => {
    const chunks = [];
    const bufferStream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      }
    });

    ffmpeg(fileTempMp4)
    .inputOptions([
      '-ss', startValue,
      '-t', finalValue
    ])
    .complexFilter([
      '[0:a] showwavespic=s=2560x480:colors=white:scale=2.0'
      ])
      // Adicione esta linha para especificar o formato de saída
      .format('image2')
      .on('end', () => {
        const imageBuffer = Buffer.concat(chunks);
        // console.log('Waveform criada com sucesso!');
        resolve(imageBuffer);
      }).pipe(bufferStream, { end: true })
      .on('error', (err) => {
        logger.error(err)
      })
  });
} 

async function forDataBase(startTime = 0, endTime = 0, id = 0) {
  let file = 0
  try {
    if(id === 0) {
      const readJson = fs.readFileSync(fileTempJson, 'utf-8')
      file = JSON.parse(readJson)
    }
  }catch (err) {
    logger.error(err)
  }
  
  const chunksStream = []
  const bufferStream = new Writable({
    write(chunk, encoding, callback) {
      chunksStream.push(chunk)
      callback() 
    }
  }).on('pipe', ()=>{
    DB.criarTabela() 
  }).on('close', async () => { 
    try {
      const type = ['jpeg', 'jpg', 'png']
      const files = fs.readdirSync(dirData)
      let tempImage = 0
      let thumbnailUrl = file.thumbnail
      
      for(let i = 0; i <= type.length - 1; i++) {
        if(files.includes(imageFile(type[i]))) {
          tempImage = fs.readFileSync(imageFile(type[i]))
          thumbnailUrl = 0
        }
      }
      
      const idFileEmpty = await DB.acessarDados('id', `WHERE video_title = 0`)
      // console.log(id, idFileEmpty)
      if(id !== 0) {
        const oldFile = await DB.acessarDados('*', `WHERE id = ${id}`)
        oldFile[0].video_file = Buffer.concat(chunksStream)
        oldFile[0].thumbnail_file = tempImage
        await DB.deletarEAtualizarDados(id, oldFile[0])
      } else{
        if(idFileEmpty && (idFileEmpty.length !== 0)){
          DB.deletarEAtualizarDados(idFileEmpty[0].id, {video_title: file.title , 
            thumbnail_link: thumbnailUrl, 
            video_link: file.url, 
            thumbnail_file: tempImage, 
            video_file: Buffer.concat(chunksStream)})
          console.log(idFileEmpty)
        
        }else {
          console.log('passo direto')
          DB.adicionarDados(file.title, thumbnailUrl, file.url, tempImage, Buffer.concat(chunksStream))
        }
      }
      
    }catch (err){
      logger.error(err)
    }
  })
  
  if(endTime <= 0) {
    ffmpeg(fileTempMp4)
    .toFormat('ogg')
    .pipe(bufferStream)
    .on('error', (err) => {
      logger.error(err)
    })
  }else {
    ffmpeg(fileTempMp4)
    .setStartTime(startTime)
    .setDuration(endTime - startTime)
    .toFormat('ogg')
    .pipe(bufferStream, {end: true})
    .on('error', (err) => {
      logger.error(err)
    })
  }
  console.log('feito', file)
}

function selectFiles(arg, id) {
  try {
    if(id === undefined){
      return DB.acessarDados(arg, 'WHERE video_title <> 0 ORDER BY order_id ASC')   
    } else {
      return DB.acessarDados(arg, `WHERE id= ${id}`) 
    }

  }catch (err){
    logger.error(err)
  }
}

    
function DeleteFile(id, args) {
  try {
    DB.deletarEAtualizarDados(id, args)

  }catch (err) {
    logger.error(err)
  }
} 

function createAudioFile(data) {
  try {
    fs.writeFileSync(fileTempMp4, data)
  }catch (err) {
    logger.error(err)
  }
}

function changeOrderId(oldId, newId) {
  try {
    DB.atualizarOrderId(oldId, newId)
  }catch (err) {
    logger.error(err)
  }
}

function hotKey(device){
  const pathFileHotKey = app.isPackaged ? path.join(app.getPath('userData'), 'hotKeyFile.txt') : './data/hotKeyFile.txt'
  const fileKey = fs.readFileSync(pathFileHotKey, 'utf-8')
  const hotKey = JSON.parse(fileKey)[device] 
  
  const mapKeys = hotKey.map(teclas => {
    return Key[teclas]
  })

  return mapKeys
}

async function mainDevice() {
  const pressKeys = hotKey('MainDevice')
  await keyboard.pressKey(...pressKeys)
  await keyboard.releaseKey(...pressKeys)
}

async function virtualCableDevice() {
  const pressKeys = hotKey('VirtualDevice')
  await keyboard.pressKey(...pressKeys)
  await keyboard.releaseKey(...pressKeys)
}

function createLogger(error) {
  logger.error(error)
}

module.exports = {
  getUrl,
  readStreamFile,
  removeTemp,
  getImage,
  getJson,
  createWaveForm,
  forDataBase,
  selectFiles,
  DeleteFile,
  createAudioFile,
  changeOrderId,
  createLogger,
  mainDevice,
  virtualCableDevice
}
          