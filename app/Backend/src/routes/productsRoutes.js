import express from 'express'
import {
    createProduct,
    updatePorduct,
    getProductById,
    getAllProducts,
    deleteProduct,
} from '../controllers/productsControllers.js'

const router = express.Router()

router.get('/', getAllProducts)

router.get('/:id', getProductById)

router.post('/', createProduct)

router.put('/:id', updatePorduct)

router.delete('/:id', deleteProduct)

export default router
