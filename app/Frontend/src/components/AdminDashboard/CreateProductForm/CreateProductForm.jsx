import { useForm } from 'react-hook-form'
import { useProducts } from '../../../context/ProductsContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CreateProductForm = () => {
    const {
        register,
        handleSubmit,
        fromState: { errors },
        reset,
    } = useForm({ mode: 'onChange' })

    const { createProduct } = useProducts()

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        const response = await createProduct(data)
        if (response.success) {
            toast.success(response.message)
            reset()
            navigate('/admin/dashboard/products')
        } else {
            toast.error(response.message)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto"
        >
            <div>
                <input
                    {...register('name', {
                        required: 'El nombre es requerido',
                        minLength: {
                            value: 3,
                            message:
                                'El nombre debe tener al menos 3 caracteres',
                        },
                        maxLength: {
                            value: 50,
                            message:
                                'El nombre debe tener menos de 500 caracteres',
                        },
                    })}
                    className={`p-2 outline-2 rounded focus:outline-primary w-full ${errors.name ? 'outline-red-400 border-red-400 focus:outline-red-400' : ''}`}
                    type="text"
                    placeholder="Nombre del producto"
                    name="name"
                    autoComplete="name"
                />
                {errors.name && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.name.message}
                    </p>
                )}
                <input
                    {...register('description', {
                        required: 'La descripcion es requerida',
                        minLength: {
                            value: 10,
                            message:
                                'La descripcion debe tener al menos 10 caracteres',
                        },
                        maxLength: {
                            value: 2000,
                            message:
                                'La descripcion debe tener menos de 2000 caracteres',
                        },
                    })}
                    className={`p-2 outline-2 rounded focus:outline-primary w-full ${errors.name ? 'outline-red-400 border-red-400 focus:outline-red-400' : ''}`}
                    type="text"
                    placeholder="Descripción"
                    name="description"
                    autoComplete="description"
                />
                {errors.description && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.description.message}
                    </p>
                )}
                <input
                    {...register('price', {
                        required: 'El precio es requerido',
                        min: {
                            value: 1,
                            message: 'El precio debe ser mayor a 0',
                        },
                    })}
                    className={`p-2 outline-2 rounded focus:outline-primary w-full ${errors.name ? 'outline-red-400 border-red-400 focus:outline-red-400' : ''}`}
                    type="number"
                    placeholder="Precio"
                    name="price"
                    autoComplete="price"
                />
                {errors.price && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.price.message}
                    </p>
                )}
                <input
                    {...register('stock', {
                        required: 'El stock es requerido',
                        min: {
                            value: 0,
                            message: 'El xtock debe ser mayor o igual a 0',
                        },
                    })}
                    className={`p-2 outline-2 rounded focus:outline-primary w-full ${errors.name ? 'outline-red-400 border-red-400 focus:outline-red-400' : ''}`}
                    type="number"
                    placeholder="Stock"
                    name="stock"
                    autoComplete="stock"
                />
                {errors.stock && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.stock.message}
                    </p>
                )}
                <input
                    {...register('imageUrl', {
                        required: 'La url de la imagen es requerida',
                    })}
                    className={`p-2 outline-2 rounded focus:outline-primary w-full ${errors.name ? 'outline-red-400 border-red-400 focus:outline-red-400' : ''}`}
                    type="text"
                    placeholder="Imagen"
                    name="imageUrl"
                    autoComplete="imageUrl"
                />
                {errors.imageUrl && (
                    <p className="text-red-400 text-sm mt-2 ml-1">
                        {errors.imageUrl.message}
                    </p>
                )}
            </div>
            <button className="btn btn-primary" type="submit">
                Crear Producto
            </button>
        </form>
    )
}

export default CreateProductForm
