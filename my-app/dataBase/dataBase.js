const sqlite = require('sqlite3').verbose()
const config = require('./config.js')
const { app } = require('electron')
const path = require('path') 

let db

function conectarBanco() {
    let pathDB
    if(app.isPackaged) {
        pathDB = path.join(app.getPath('userData'), config.dataBase)
    }else {
        pathDB = `./dataBase/${config.dataBase}`
    }

    db = new sqlite.Database(pathDB, (err) => {
        if(err) {
            console.log(err)
        }
        console.log('conexão aberta')

    })
    return db
}



function fecharBanco() {
    if (!db) {
        console.log('Nenhum banco de dados aberto para fechar.'); // Resolve imediatamente se não há nada para fechar
    }

    db.close((err) => {
        if (err) {
            console.error("Erro ao fechar o banco de dados:", err.message);
        }
        
        // 💡 CORREÇÃO: Resolve a Promise SOMENTE DEPOIS que a função de fechamento termina.
        console.log('Conexão fechada com sucesso!');
        
    });
}

async function criarTabela() {
    try {
        await conectarBanco()
        await db.run(`CREATE TABLE soundFiles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    video_title TEXT NOT NULL,
                    thumbnail_link Text NOT NULL,
                    video_link TEXT NOT NULL,
                    thumbnail_file BLOB,
                    video_file BLOB,
                    order_id INTEGER NOT NULL)`, () => {
                        console.log('tabela criada com sucesso')
                    })
        await fecharBanco()
    }catch (err){
        console.error(err.message)
    }
}

async function orderId() {
    const file = await acessarDados('MAX(id)')
    if(file !== null) {
        const newOrderIdValue = Object.values(file[0])[0] + 1
        return parseInt(newOrderIdValue)
    }
    return 0
}

async function adicionarDados(title, thumbnail_link, video_link, thumbnail_file , video_file) {
    try {
        await conectarBanco()
        const inserir = await db.prepare('INSERT INTO soundFiles (video_title, thumbnail_link, video_link, thumbnail_file, video_file, order_id ) VALUES (?, ?, ?, ?, ?, ?)')
        await inserir.run(title, thumbnail_link, video_link, thumbnail_file , video_file, await orderId(), (err) => {
            if(err) {
                console.log(err)
            }

            console.log('dados inseridos com sucesso')
        })
        await fecharBanco()
    }catch (err) {
        console.error(err.message)
    }
}
function acessarDados(selectItens , whereItens = '') {
    return new Promise(async (resolve) => {
        try{
            await conectarBanco()
            await db.all(`SELECT ${selectItens} FROM soundFiles ${whereItens}`, (err, rows) => {
                resolve(rows)
            })
            await fecharBanco()
        }
        catch (err) {
            console.log(err)
        }
    })
}

async function deletarEAtualizarDados(id, dados) {
    try {
        let {video_title, thumbnail_link, video_link, thumbnail_file, video_file} = dados
        if(dados === 0) {
            video_title = 0, 
            thumbnail_link = 0, 
            video_link = 0, 
            thumbnail_file = 0, 
            video_file = 0
        }
        
        await conectarBanco()
        const update_file = await db.prepare('UPDATE soundFiles SET video_title = ?, thumbnail_link = ?, video_link = ?, thumbnail_file = ?, video_file = ? WHERE id = ?  ')
        update_file.run(video_title, thumbnail_link, video_link, thumbnail_file, video_file, id, 
            () => console.log('atualizado com sucesso'))
        await fecharBanco()
    }catch (err) {
        console.log(err.message)
    }

}

async function atualizarOrderId(oldId, newId) {
    await conectarBanco()
    console.log(oldId, newId)
    try {
        const orderId = await db.prepare('UPDATE soundFiles SET order_id = ? WHERE id = ?')
        orderId.run(newId, oldId, () => console.log('atualizado'))
    }catch (err) {
        console.error(err)
    }
    await fecharBanco()
}


module.exports = {
    criarTabela,
    adicionarDados,
    deletarEAtualizarDados,
    acessarDados,
    atualizarOrderId
}

