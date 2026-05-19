import { useUser } from '../../context/UserContext'
import toast from 'react-hot-toast'
import logoutService from '../../services/logoutService'

const UserDropDown = () => {
    const { SetUserInfo } = useUser()
    const handleLogout = async () => {
        try {
            await logoutService()
            SetUserInfo({})
            toast.success('Sesión cerrada correctamente')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            toast.error('Error al cerrar sesión')
        }
    }
    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
            >
                <div className="w-10 rounded-full">
                    <img
                        src="https://img.icons8.com/ios/50/user--v1.png"
                        alt="User avatar"
                    />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
                <li>
                    <a className="justify-between">
                        Perfil
                        <span className="badge">Nuevo</span>
                    </a>
                </li>
                <li>
                    <a className="justify-between">Configuración</a>
                </li>
                <li>
                    <a className="justify-between" onClick={handleLogout}>
                        Cerrar sesión
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
