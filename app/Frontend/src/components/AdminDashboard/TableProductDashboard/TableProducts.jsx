import { Link } from 'react-router'
import { useProduct } from '../../context/ProductContext'
import toast from 'react-hot-toast'

const TableProducts = ({ products }) => {
    const { deleteProduct } = useProduct()
    const onHandleDelete = async (id) => {
        const result = await deleteProduct(id)
        if (result.success) {
            toast.success('Producto eliminado correctamente')
        } else {
            toast.error('Error al eliminar el producto')
        }
    }

    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Image</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={`${product._id}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td>{product.imageUrl}</td>
                        <td>
                            <Link
                                className="btn btn-info"
                                to={`/admin/dashboard/products/updateProduct/${product._id}`}
                            >
                                Edit
                            </Link>
                        </td>
                        <td>
                            <button
                                className="btn btn-error"
                                onClick={() => onHandleDelete(product._id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TableProducts
