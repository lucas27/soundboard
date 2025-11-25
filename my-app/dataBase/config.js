const env = require('env-var')
require('dotenv').config()

const config = {
    dataBase: env.get('DATA_BASE_NAME').default('myDataBase.db').asString()
}

module.exports = config


