import CardProduct from '../components/CardProduct/CardProduct'
import { useProduct } from '../context/ProductContext'

const Home = () => {
    const { products, productsLoading, error } = useProduct()
    return (
        <div>
            <p className="text-center mb-4">Elegi tu producto ⬇</p>
            <div className="flex flex-wrap gap-5 justify-center">
                {productsLoading ? (
                    <div className="loading loading-spinner"></div>
                ) : error ? (
                    <p>Error al cargar los productos</p>
                ) : (
                    products.map((product) => (
                        <CardProduct key={product._id} product={product} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Home
