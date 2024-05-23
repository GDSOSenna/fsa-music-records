//Importa a função rotas do express

const router = require('express').Router()

//Importa o o controller do product (lógica do CRUD)

const typeController = require('../controllers/typeController')

//Importa os mêtodos das rotas

router.get('/type', typeController.getAllType)
router.get('/type/:id', typeController.getTypeById)
router.post('/type', typeController.createType)
router.put('/type/:id', typeController.updateType)
router.delete('/type/:id', typeController.deleteType)

//Exporta a rota para uso

module.exports = router