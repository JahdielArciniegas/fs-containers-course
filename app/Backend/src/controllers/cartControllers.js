import CartModel from '../models/CartModel.js'
import ProductModel from '../models/ProductModel.js'
export const addToCart = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId
        const { productId, quantity = 1 } = req.body

        if (!userId) {
            return res.status(400).json({ message: 'El userId es requerido' })
        }

        if (!productId) {
            return res
                .status(400)
                .json({ message: 'El productId es requerido' })
        }

        if (quantity < 1) {
            return res
                .status(400)
                .json({ message: 'La cantidad debe ser al menos de 1' })
        }

        const product = await ProductModel.findById(productId)

        if (!product) {
            return res.status(400).json({ message: 'Producto no econtrado' })
        }

        let cart = await CartModel.findOne({ userId })

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId
            )

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Solo hay ${product.stock} de unidades disponibles`,
                })
            }

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity
            } else {
                console.log('USUARIO NO TIENE CARRITO')

                cart.products.push({ productId, quantity })
            }
        } else {
            cart = new CartModel({
                userId,
                products: [{ productId, quantity }],
            })
        }

        await cart.save()

        await cart.populate('products.productId')

        res.status(200).json({
            message: 'Producto agregado al carrito',
            cart,
        })
    } catch (error) {
        res.json({ message: 'ERROR' })
    }
}

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params

        const cart = await CartModel.findOne({ userId }).populate(
            'products.productId'
        )

        if (cart) {
            res.status(200).json({
                message: 'Carrito obtenido con éxito',
                cart,
            })
        } else {
            res.status(404).json({ message: 'Carrito no econtrado' })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor al obtener el carrito',
            error: error.message,
        })
    }
}

export const updateCart = async (req, res) => {
    try {
        const { userId } = req.params
        const { productId, quantity } = req.body
        console.log('UPDATE CART', productId, quantity)

        const cart = await CartModel.findOne({ userId })

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no econtrado' })
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        )

        if (productIndex > -1) {
            const product = await ProductModel.findById(productId)

            if (!product) {
                return res.status(404).json({
                    message: 'Producto no econtrado',
                })
            }

            if (quantity > product.stock) {
                return res.status(400).json({
                    message: `Solo hay ${product.stock} unidades disponibles`,
                })
            }

            cart.products[productIndex].quantity = quantity

            await cart.save()

            res.status(200).json({
                message: 'Carrito actualizado con éxito',
                cart,
            })
        } else {
            res.status(404).json({
                message: 'Producto no econtrado en el carrito',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor al actualizar el carrito',
            error: error.message,
        })
    }
}

export const removeProductFromCart = async (req, res) => {
    try {
        const { userId } = req.params
        const { productId } = req.body

        if (!userId) {
            return res.status(400).json({ message: 'El userId es requerido' })
        }

        const cart = await CartModel.findOne({ userId })

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' })
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        )

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1)

            await cart.save()

            res.status(200).json({
                message: 'Producto eliminado del carrito con éxito',
                cart,
            })
        } else {
            res.status(404).json({
                message: 'Producto no encontrado en el carrito',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor al eliminar el producto del carrito',
        })
    }
}

export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params

        const cart = await CartModel.findOne({ userId })

        if (cart) {
            cart.products = []
            await cart.save()
            res.status(200).json({
                message: 'Carrito vaciado con éxito',
                cart,
            })
        } else {
            res.status(404).json({
                message: 'Carrito no encontrado',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor al eliminar un producto',
        })
    }
}

export const getCartTotal = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId

        if (!userId) {
            return res.status(400).json({
                message: 'El userId es requerid',
            })
        }

        const cart = await CartModel.findOne({ userId }).populate(
            'products.productId'
        )

        if (!cart) {
            return res.status(404).json({
                message: 'Carrito no encontrado',
            })
        }

        if (cart) {
            const total = cart.products.reduce((acc, item) => {
                return acc + item.productId.price * item.quantity
            }, 0)

            res.status(200).json({
                message: 'Total obtenido con éxito',
                total,
            })
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error del servidor al obtener el total',
        })
    }
}
