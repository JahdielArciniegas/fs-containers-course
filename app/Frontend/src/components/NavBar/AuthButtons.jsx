import { Link } from 'react-router'

const AuthButtons = () => {
    return (
        <div className="py-4 flex justify-center items-center gap-4 flex-wrap">
            <Link to="/register" className="btn btn-neutral btn-outline">
                Crear cuenta
            </Link>
            <div className="hidden lg:block"> | </div>
            <Link to="/login" className="btn btn-neutral btn-outline">
                Iniciar sesión
            </Link>
        </div>
    )
}

export default AuthButtons
