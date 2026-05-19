import Cart from './Cart'
import AuthButtons from './AuthButtons'
import UserDropDown from './UserDropDown'
import { Link } from 'react-router'
import { useUser } from '../../context/UserContext'

const Navbar = () => {
    const { loading, userInfo } = useUser()

    return (
        <header>
            <AuthButtons />
            <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-xl">
                        E-comerce
                    </Link>
                </div>
                <div className="navbar-end gap-3">
                    {userInfo?.isAdmin && (
                        <Link to="#" className="btn btn-primary">
                            Dashboard
                        </Link>
                    )}
                    <Cart />
                    {!loading && userInfo?.username && <UserDropDown />}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
