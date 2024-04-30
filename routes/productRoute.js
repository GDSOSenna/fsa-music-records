//Importa a função rotas do express

const router = require('express').Router()

//Importa o o controller do product (lógica do CRUD)

const productController = require('../controllers/productController')

//Importa os mêtodos das rotas

router.get('/products', productController.getAllProducts)
router.get('/products/:id', productController.getProductById)
router.get('/products/gender/:genderId', productController.getProductByType)
router.post('/products', productController.createProduct)
router.put('/products/:id', productController.updateProduct)
router.delete('/products/:id', productController.deleteProduct)

//Exporta a rota para uso

module.exports = router