//Importa a função rotas do express

const router = require('express').Router()

//Importa o o controller do product (lógica do CRUD)

const artistController = require('../controllers/artistController')

//Importa os mêtodos das rotas

router.get('/artist', artistController.getAllArtist)
router.get('/artist/:id', artistController.getArtistById)
router.post('/artist', artistController.createArtist)
router.put('/artist/:id', artistController.updateArtist)
router.delete('/artist/:id', artistController.deleteArtist)

//Exporta a rota para uso

module.exports = router