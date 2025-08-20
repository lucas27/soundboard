const fs = require('fs')
const videoInfo = require('./downloadAudio')

videoInfo.display(videoInfo.videoInBytes)

const file = {
    nome: 'dmfomsmfosdmf',
    imagem: 'smdmioasmcnsnasn',
    duração: '3:40',
    blobFile: videoInfo.videoInBytes
}

const dadosJson = JSON.stringify(file, null, 2)

fs.writeFile('temp.json', dadosJson, (err)=> {
    if(err)
        console.log(err)
})