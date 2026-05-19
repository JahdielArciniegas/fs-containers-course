import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL + '/cart'

axios.defaults.withCredentials = true

export const addToCartService = async (userId, productId, quantity = 1) => {
    try {
        const response = await axios.post(`${API_URL}/add`, {
            userId,
            productId,
            quantity,
        })
        return response.data
    } catch (error) {
        throw new Error('Error al agregar productos al carrito', error)
    }
}

export const getCartService = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/get/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener el carrito', error)
    }
}

export const updateCartService = async (userId, productId, quantity) => {
    try {
        const response = await axios.put(`${API_URL}/update/${userId}`, {
            productId,
            quantity,
        })
        return response.data
    } catch (error) {
        throw new Error('Error al actualizar el carrito', error)
    }
}

export const removeFromCartService = async (userId, productId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/removeProduct/${userId}`,
            {
                data: {
                    productId,
                },
            },
        )
        return response.data
    } catch (error) {
        throw new Error('Error al remover producto del carrito', error)
    }
}

export const clearCartService = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/clear/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al limpiar el carrito', error)
    }
}

export const getCartTotalService = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/total/${userId}`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener el total del carrito', error)
    }
}
