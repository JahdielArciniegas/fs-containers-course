import z from 'zod'
import productModel from '../models/productModel.js'
import { productSchema } from '../schemas/productSchema.js'

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, imageUrl } =
            productSchema.parse(req.body)
        const product = await productModel.create({
            name,
            description,
            price,
            stock,
            imageUrl,
        })
        return res
            .status(201)
            .json({ message: 'Producto creado exitosamente' }, product)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res
                .status(400)
                .json(error.issues.map((issue) => issue.message))
        }
        return res.status(500).json({ message: error.message })
    }
}

export const updatePorduct = async (req, res) => {
    try {
        const validateData = productSchema.partial().parse(req.body)

        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            validateData,
            { new: true, runValidators: true }
        )

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        return res
            .status(200)
            .json(
                { message: 'Producto actualizado exitosamente' },
                updatedProduct
            )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res
                .status(400)
                .json(error.issues.map((issue) => issue.message))
        }
        return res.status(500).json({ message: error.message })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find()
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        return res
            .status(200)
            .json({ message: 'Producto eliminado exitosamente' }, product)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
