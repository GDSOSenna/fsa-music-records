//Importa a função rotas do express

const router = require('express').Router()

//Importa o o controller do media (lógica do CRUD)

const mediaController = require('../controllers/mediaController')

//Importa os mêtodos das rotas

router.get('/medias', mediaController.getAllMedias)
router.get('/medias/:id', mediaController.getMediaById)
router.get('/medias/gender/:genderId', mediaController.getMediaByType)
router.post('/medias', mediaController.createMedia)
router.put('/medias/:id', mediaController.updateMedia)
router.delete('/medias/:id', mediaController.deleteMedia)

//Exporta a rota para uso

module.exports = router