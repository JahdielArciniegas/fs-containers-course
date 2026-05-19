import { useContext, createContext, useState, useEffect } from 'react'
import { getProfileService } from '../services/authServices'

const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)

    const checkSession = async () => {
        try {
            setLoading(true)
            const userData = await getProfileService()
            setUserInfo(userData)
        } catch (error) {
            console.error('Error checking session:', error)
            setUserInfo({})
        } finally {
            setLoading(false)
        }
    }

    const getUserId = () => {
        return userInfo?._id || null
    }

    const isAuthenticated = () => {
        return !!userInfo?._id
    }

    useEffect(() => {
        checkSession()
    }, [])

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                loading,
                setLoading,
                checkSession,
                getUserId,
                isAuthenticated,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext)
