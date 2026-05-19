import { Routes, Route } from 'react-router'
import Layout from './layout/Layout'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { UserContextProvider } from './context/UserContext'
import { ProductContextProvider } from './context/ProductContext'
import { CartContextProvider } from './context/CartContext'
import { Toaster } from 'react-hot-toast'
import DetailProduct from './pages/DetailProduct'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
    return (
        <UserContextProvider>
            <Toaster />
            <ProductContextProvider>
                <CartContextProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/detailProduct/:id"
                                element={<DetailProduct />}
                            />
                            <Route
                                path="/admin/dashboard/*"
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </CartContextProvider>
            </ProductContextProvider>
        </UserContextProvider>
    )
}

export default App
