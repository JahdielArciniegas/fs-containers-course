import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'

const CardProduct = ({
    product: { _id, name, price, imageUrl, description, stock },
}) => {
    const { isAuthenticated } = useUser()
    const { addToCart, loading, openModal } = useCart()

    const handleAddToCart = () => {
        addToCart({ _id, name, price, imageUrl, description, stock })
        openModal()
    }

    return (
        <div className="card bg-base-100 w-100 w-80 lg:w-[30%] shadow-lg">
            <figure>
                <img
                    className="aspect-[9/9] object-cover"
                    src={imageUrl}
                    alt="tazas"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <div className="badge badge-warning">{price}</div>
                <p>{description}</p>
                <div className="card-actions justify-between mt-4">
                    <Link
                        className="btn btn-info btn-sm md:btn-md"
                        to={`/detailPorduct/${_id}`}
                    >
                        Ver Setalles
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={loading || stock === 0}
                        className="btn btn-success btn-sm md:btn-md"
                    >
                        <FaShoppingCart size={16} />
                        {stock === 0 ? 'Sin stock' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardProduct
