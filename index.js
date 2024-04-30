//importa a tool express

const express = require('express')

//usa app como função do express (poderia ser qualquer outro nome, exemplo: cristianoPindamonhangaba)

const app = express()

//utiliza o express para a leitura de funções json

app.use(express.json())

//Importa os arquivos de rotas criados para a funcionalidade da APIrest

app.use(require('./routes/productRoute'))
/*
app.use(require('./routes'))
*/
//Starta o servidor na porta escolhida

app.listen(4000, () => console.log('Server started on port 4000'))