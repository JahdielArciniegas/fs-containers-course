import { createContext, useState, useEffect, useContext } from 'react'
import { useUser } from './UserContext'
import {
    addToCartService,
    getCartService,
    updateCartService,
    clearCartService,
    removeFromCartService,
    getCartTotalService,
} from '../services/cartServices'
import toast from 'react-hot-toast'

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext()

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const [itemsQuantity, setItemsQuantity] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const {
        getUserId,
        isAuthenticated,
        loading: userLoading,
        userInfo,
    } = useUser()

    const loadLocalCart = () => {
        try {
            const localCart = localStorage.getItem('cart')
            return localCart ? JSON.parse(localCart) : []
        } catch (error) {
            console.error('Error cargar el carrito local:', error)
            return []
        }
    }

    const saveLocalCart = (cartItems) => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        } catch (error) {
            console.error('Error guardar el carrito local:', error)
        }
    }

    const loadCart = async () => {
        if (isAuthenticated) {
            try {
                setLoading(true)
                const userId = getUserId()
                const response = await getCartService(userId)
                const cartItems =
                    response.cart?.products?.map((item) => ({
                        _id: item.productId._id,
                        name: item.productId.name,
                        price: item.productId.price,
                        quantity: item.quantity,
                        stock: item.productId.stock,
                        imageUrl: item.productId.imageUrl,
                        description: item.productId.description,
                    })) || []
                setCart(cartItems)
            } catch (error) {
                console.error('Error cargar el carrito:', error)
            } finally {
                setLoading(false)
            }
        } else {
            const localCart = loadLocalCart()
            setCart(localCart)
            setLoading(false)
        }
    }

    const syncCartWithBackend = async () => {
        const localCart = loadLocalCart()
        if (localCart.length > 0 && isAuthenticated()) {
            try {
                setLoading(true)
                const userId = getUserId()
                for (const item of localCart) {
                    try {
                        await addToCartService(userId, item._id, item.quantity)
                    } catch (error) {
                        console.error(
                            'Error agregar producto al carrito:',
                            error,
                        )
                    }
                }

                localStorage.removeItem('cart')

                await loadCart()
                toast.success('Carrito sincronizado con el backend')
            } catch (error) {
                console.error(
                    'Error sincronizar el carrito con el backend:',
                    error,
                )
            } finally {
                setLoading(false)
            }
        }
    }

    const addToCart = async (product, quantity = 1) => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                const userId = getUserId()
                await addToCartService(userId, product._id, quantity)
                await loadCart()
                toast.success('Producto agregado al carrito')
            } catch (error) {
                console.error('Error agregar producto al carrito:', error)
                toast.error('Error al agregar el producto al carrito')
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const currentCart = [...cart]
                const existingIndex = currentCart.findIndex(
                    (item) => item._id === product._id,
                )
                if (existingIndex > -1) {
                    currentCart[existingIndex].quantity += quantity
                } else {
                    currentCart.push({ ...product, quantity })
                    setCart(currentCart)
                    saveLocalCart(currentCart)
                    toast.success('Producto agregado al carrito')
                }
            } catch (error) {
                console.error('Error agregar producto al carrito:', error)
                toast.error('Error al agregar el producto al carrito')
            }
        }
    }

    const removeFromCart = async (productId) => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                const userId = getUserId()
                await removeFromCartService(userId, productId)
                await loadCart()
                toast.success('Producto eliminado del carrito')
            } catch (error) {
                console.error('Error eliminar producto del carrito:', error)
                toast.error('Error al eliminar el producto del carrito')
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const currentCart = cart.filter(
                    (item) => item._id !== productId,
                )
                setCart(currentCart)
                saveLocalCart(currentCart)
                toast.success('Producto eliminado del carrito')
            } catch (error) {
                console.error('Error eliminar producto del carrito:', error)
                toast.error('Error al eliminar el producto del carrito')
            }
        }
    }

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            toast.error('La cantidad debe ser mayor a 0')
            return
        }

        if (isAuthenticated()) {
            try {
                setLoading(true)
                const userId = getUserId()
                await updateCartService(userId, productId, newQuantity)
                await loadCart()
                toast.success('Cantidad actualizada')
            } catch (error) {
                console.error('Error actualizar cantidad:', error)
                toast.error('Error al actualizar la cantidad')
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const currentCart = cart.map((item) =>
                    item._id === productId
                        ? { ...item, quantity: newQuantity }
                        : item,
                )
                setCart(currentCart)
                saveLocalCart(currentCart)
                toast.success('Cantidad actualizada')
            } catch (error) {
                console.error('Error actualizar cantidad:', error)
                toast.error('Error al actualizar la cantidad')
            }
        }
    }

    const clearCart = async () => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                const userId = getUserId()
                await clearCartService(userId)
                setCart([])
                toast.success('Carrito vaciado')
            } catch (error) {
                console.error('Error vaciar carrito:', error)
                toast.error('Error al vaciar el carrito')
            } finally {
                setLoading(false)
            }
        } else {
            try {
                setCart([])
                saveLocalCart([])
                toast.success('Carrito vaciado')
            } catch (error) {
                console.error('Error vaciar carrito:', error)
                toast.error('Error al vaciar el carrito')
            }
        }
    }

    useEffect(() => {
        let isMounted = true

        const initializeCart = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            if (isMounted) return

            const previousAuthState = localStorage.getItem('wasAuthenticated')
            const currentAuthState = isAuthenticated()

            if (!previousAuthState && currentAuthState) {
                await syncCartWithBackend()
            } else {
                await loadCart()
            }

            localStorage.setItem(
                'wasAuthenticated',
                currentAuthState.toString(),
            )

            setLoading(false)
        }

        initializeCart()

        return () => {
            isMounted = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLoading])

    useEffect(() => {
        const previousAuthState =
            localStorage.getItem('wasAuthenticated') === 'true'
        const currentAuthState = isAuthenticated()

        if (previousAuthState !== currentAuthState && cart.length === 0) {
            loadCart()
            localStorage.setItem(
                'wasAuthenticated',
                currentAuthState.toString(),
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (userLoading) return

        if (userInfo?.id) {
            ;(async () => {
                try {
                    const localCart = loadLocalCart()
                    if (localCart.length > 0) {
                        await syncCartWithBackend()
                    } else {
                        await loadCart()
                    }
                } catch (error) {
                    console.error('Error al sincronizar carrito:', error)
                }
            })()
        } else {
            try {
                setCart(loadLocalCart())
            } catch (error) {
                console.error('Error al cargar carrito local:', error)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo?.id, userLoading])

    useEffect(() => {
        const newTotal = cart.reduce(
            (acc, item) => acc + item.price * (item.quantity || 1),
            0,
        )
        setTotal(newTotal)
        const newItemsQuantity = cart.reduce(
            (acc, item) => acc + (item.quantity || 1),
            0,
        )
        setItemsQuantity(newItemsQuantity)
    }, [cart])

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                total,
                itemsQuantity,
                isModalOpen,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotalService,
                loadCart,
                openModal,
                closeModal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
