//importa a tool express

const express = require('express')

//usa app como função do express (poderia ser qualquer outro nome, exemplo: cristianoPindamonhangaba)

const app = express()

//utiliza o express para a leitura de funções json

app.use(express.json())

//Importa Cors

const cors = require('cors')

app.use(cors())

//Importa os arquivos de rotas criados para a funcionalidade da APIrest

app.use(require('./routes/mediaRoute'))

app.use(require('./routes/genderRoute'))

app.use(require('./routes/artistRoute'))

app.use(require('./routes/typeRoute'))

//Starta o servidor na porta escolhida

app.listen(4000, () => console.log('Server started on port 4000'))