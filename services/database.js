//importa a tool pg (postgres)

const {Pool} = require("pg")

//conecta a string do banco relacional

const pool = new Pool({
    connectionString: 'postgres://houptqya:aSyNWWpuf6LTr_KJqgbFvKL5RyeSvS5Q@silly.db.elephantsql.com/houptqya'
})

//exporta a função pool

module.exports = {pool}