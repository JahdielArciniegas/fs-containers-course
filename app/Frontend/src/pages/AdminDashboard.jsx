import { Route, Routes } from 'react-router'
import TableProductDashboard from '../components/AdminDashboard/TableProductDashboard/TableProductDashboard'
import DashboardLayout from '../layouts/DashboardLayout'
import CreateProduct from './CreateProduct'
import UpdateProduct from './UpdateProduct'

const AdminDashboard = () => {
    return (
        <section>
            <Routes>
                <Route path="/products" element={<DashboardLayout />}>
                    <Route path="/" element={<TableProductDashboard />} />
                    <Route path="/createProduct" element={<CreateProduct />} />
                    <Route
                        path="/updateProduct/:id"
                        element={<UpdateProduct />}
                    />
                </Route>
            </Routes>
        </section>
    )
}

export default AdminDashboard
