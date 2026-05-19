import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { registerService } from '../../services/authServices'
import { Navigate } from 'react-router'
import toast from 'react-hot-toast'
const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange',
    })

    const { userInfo, checkSession } = useUser()
    const [redirect, setRedirect] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (data) => {
        const result = await registerService(
            data,
            reset,
            setRedirect,
            checkSession,
        )
        if (result.message) {
            toast.success('Registro exitoso')
        } else {
            toast.error(result.error || 'Error al registrar')
        }
    }

    if (redirect && userInfo.isAdmin) {
        return <Navigate to="/admin" />
    }

    if (redirect && !userInfo.isAdmin) {
        return <Navigate to="/" />
    }

    return (
        <form
            className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <input
                    {...register('username', {
                        required: 'El nombre de usuario es requerido',
                        minLength: {
                            value: 3,
                            message:
                                'El nombre de usuario debe tener al menos 3 caracteres',
                        },
                        maxLength: {
                            value: 20,
                            message:
                                'El nombre de usuario no puede tener más de 20 caracteres',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${errors.username ? 'border-red-500 outline-red-500 focus:outline-red-500' : ''}`}
                    name="username"
                    autoComplete="username"
                    type="text"
                    placeholder="Nombre de usuario"
                />
                {errors.username && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.username.message}
                    </p>
                )}
            </div>
            <div>
                <input
                    {...register('email', {
                        required: 'El correo electronico es requerido',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'El correo electronico no es válido',
                        },
                        minLength: {
                            value: 6,
                            message:
                                'El correo electronico debe tener al menos 6 caracteres',
                        },
                        maxLength: {
                            value: 254,
                            message:
                                'El correo electronico no puede tener más de 254 caracteres',
                        },
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${errors.email ? 'border-red-500 outline-red-500 focus:outline-red-500' : ''}`}
                    name="email"
                    autoComplete="email"
                    type="email"
                    placeholder="Correo Electronico"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.email.message}
                    </p>
                )}
            </div>
            <div className="relative">
                <input
                    {...register('password', {
                        required:
                            'La contraseña es requerida [6 - 254 caracteres]',
                        minLength: {
                            value: 6,
                            message:
                                'La contraseña debe tener al menos 6 caracteres',
                        },
                        maxLength: {
                            value: 254,
                            message:
                                'La contraseña no puede tener más de 254 caracteres',
                        },
                    })}
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full ${errors.password ? 'border-red-500 outline-red-500 focus:outline-red-500' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                />
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                        showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                    }
                    type="button"
                    className="cursor-pointer absolute right-4 top-[20px] transform -translate-y-1/2 text-gray-600"
                >
                    {showPassword ? (
                        <FaEyeSlash size={23} />
                    ) : (
                        <FaEye size={23} />
                    )}
                </button>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.password.message}
                    </p>
                )}
            </div>
            <button className="btn btn-primary" type="submit">
                Registrarse
            </button>
        </form>
    )
}

export default RegisterForm
