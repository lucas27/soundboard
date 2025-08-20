const sqlite = require('sqlite3')
const config = require('./config.js')

let db

function conectarBanco() {
    db = new sqlite.Database(config.dataBase, () => {
        console.log('conexão aberta')
    })
    return db
}

function fecharBanco() {
    return db ? db.close(() => {
        console.log('fechado com sucesso')
    }) : console.log('nenhum banco de dados para fechar')
}

async function criarTabela() {
    try {
        await conectarBanco()
        await db.run(`CREATE TABLE IF NOT EXISTS soundFiles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    video_name TEXT NOT NULL,
                    video_link TEXT UNIQUE NOT NULL,
                    blob_file BLOB)`, () => {
                        console.log('tabela criada com sucesso')
                    })
        await fecharBanco()
    }catch (err){
        console.error(err.message)
    }
}

async function adicionarDados(nome, link , blob) {
    try {
        await conectarBanco()
        const inserir = await db.prepare('INSERT INTO soundFiles (video_name, video_link, blob_file) VALUES (?, ?, ?)')
        await inserir.run(nome , link, blob, () => {
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

async function deletarDados(id) {
    try {
        await conectarBanco()
        const delete_file = await db.prepare('DELETE FROM soundFiles WHERE id = ?')
        delete_file.run(id, () => {
            console.log('deletado com sucesso')
        })
        await fecharBanco()
    }catch (err) {
        console.log(err.message)
    }

}

module.exports = {
    criarTabela,
    adicionarDados,
    deletarDados,
    acessarDados
}

