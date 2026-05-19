import { Link } from 'react-router'
import { useProducts } from '../../../context/ProductContext'
import TableProducts from '../TableProducts'

const TableProductDashboard = () => {
    const { products, productLoading } = useProducts()

    return (
        <>
            <div className="flex items-center gap-4 justify-center">
                <h1>Admin Productos</h1>
            </div>
            <Link
                to="/admin/dashboard/products/createProduct"
                className="btn btn-primary"
            >
                Crear Producto
            </Link>
            <div className="overflow-x-auto">
                {productLoading ? (
                    <div className="loading loading-spinner"></div>
                ) : (
                    <TableProducts products={products} />
                )}
            </div>
        </>
    )
}

export default TableProductDashboard
