import {
    useState,
    useEffect,
    useCallback,
    createContext,
    useContext,
} from 'react'

import axios from 'axios'

axios.defaults.withCredentials = true

const API_URL = import.meta.env.VITE_API_URL + '/products'

// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext({})

export const ProductContextProvider = ({ children }) => {
    const [products, setProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [product, setProduct] = useState({})
    const [productLoading, setProductLoading] = useState(true)
    const [error, setError] = useState(null)

    const getProducts = useCallback(async () => {
        try {
            const response = await axios.get(API_URL)
            setProducts(response.data)
        } catch (error) {
            setError(error.message || 'Error al cargar los productos')
        } finally {
            setProductsLoading(false)
        }
    }, [])

    const getProductById = useCallback(async (id) => {
        setProductLoading(true)
        setProduct({})
        try {
            const response = await axios.get(`${API_URL}/${id}`)
            setProduct(response.data)
        } catch (error) {
            setError(error.message || 'Error al cargar el producto')
        } finally {
            setProductLoading(false)
        }
    }, [])

    const updateProduct = useCallback(async (id, productData) => {
        const cleanData = {
            name: productData.name,
            description: productData.description,
            price: Number(productData.price),
            stock: Number(productData.stock),
            imageUrl: productData.imageUrl,
        }
        try {
            const response = await axios.put(`${API_URL}/${id}`, cleanData, {
                withCredentials: true,
            })
            if (response.status === 200) {
                setProduct(response.data)
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === id ? response.data : product,
                    ),
                )
            }
            return {
                success: true,
                message: 'Producto actualizado correctamente',
            }
        } catch (error) {
            setError(error.message || 'Error al actualizar el producto')
            return {
                success: false,
                message: 'Error al actualizar el producto',
            }
        } finally {
            setProductLoading(false)
            setProductsLoading(false)
        }
    }, [])

    const createProduct = useCallback(async (productData) => {
        const cleanData = {
            name: productData.name,
            description: productData.description,
            price: Number(productData.price),
            stock: Number(productData.stock),
            imageUrl: productData.imageUrl,
        }
        try {
            const response = await axios.post(API_URL, cleanData, {
                withCredentials: true,
            })
            if (response.status === 201) {
                setProducts((prevProducts) => [
                    ...prevProducts,
                    response.data.product,
                ])
            }
            return {
                success: true,
                message: 'Producto creado correctamente',
            }
        } catch (error) {
            setError(error.message || 'Error al crear el producto')
            return {
                success: false,
                message: 'Error al crear el producto',
            }
        } finally {
            setProductLoading(false)
            setProductsLoading(false)
        }
    }, [])

    const deleteProduct = useCallback(async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                withCredentials: true,
            })
            if (response.status === 200) {
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product._id !== id),
                )
            }
            return {
                success: true,
                message: 'Producto eliminado correctamente',
            }
        } catch (error) {
            setError(error.message || 'Error al eliminar el producto')
            return {
                success: false,
                message: 'Error al eliminar el producto',
            }
        } finally {
            setProductsLoading(false)
        }
    }, [])

    useEffect(() => {
        getProducts()
    }, [getProducts])

    const value = {
        products,
        product,
        productsLoading,
        productLoading,
        error,
        getProducts,
        getProductById,
        updateProduct,
        createProduct,
        deleteProduct,
    }

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => useContext(ProductContext)
