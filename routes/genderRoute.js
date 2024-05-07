//Importa a função rotas do express

const router = require('express').Router()

//Importa o o controller do product (lógica do CRUD)

const genderController = require('../controllers/genderController')

//Importa os mêtodos das rotas

router.get('/gender', genderController.getAllGender)
router.get('/gender/:id', genderController.getGenderById)
router.post('/gender', genderController.createGender)
router.put('/gender/:id', genderController.updateGender)
router.delete('/gender/:id', genderController.deleteGender)

//Exporta a rota para uso

module.exports = router