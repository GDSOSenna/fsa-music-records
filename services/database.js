//importa a tool pg (postgres)

const {Pool} = require("pg")

//conecta a string do banco relacional

const pool = new Pool({
    connectionString: 'postgres://hoavjeqv:eDIMGWB6Ougma4EgTBH7czvrtu0X-lpr@silly.db.elephantsql.com/hoavjeqv'
})

//exporta a função pool

module.exports = {
    pool
}