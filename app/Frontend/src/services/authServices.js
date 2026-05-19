import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL + '/auth'

axios.defaults.withCredentials = true

export const getProfileService = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`)
        return response.data
    } catch (error) {
        console.error('Error al obtener el perfil:', error)
        throw new Error(
            error.response?.data?.message || 'Error al obtener el perfil',
        )
    }
}

export const loginService = async (data, reset, setRedirect, setUserInfo) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
        if (response.status === 200) {
            setUserInfo(response.data.user)
            setRedirect(true)
            reset()
            return {
                success: true,
                message: 'Inicio de sesion exitoso',
            }
        }
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        return {
            success: false,
            message: 'Error al iniciar sesión',
        }
    }
}

export const registerService = async (
    data,
    reset,
    setRedirect,
    checkSession,
) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })

        if (response.status === 201 || response.status === 200) {
            await checkSession()
            reset()
            setRedirect(true)

            return {
                message: true,
            }
        }
        // eslint-disable-next-line no-unused-vars
    } catch (e) {
        return {
            message: false,
        }
    }
}

export const logoutService = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`, {
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.error('Error al cerrar sesión:', error)
        throw new Error(
            error.response?.data?.message || 'Error al cerrar sesión',
        )
    }
}
