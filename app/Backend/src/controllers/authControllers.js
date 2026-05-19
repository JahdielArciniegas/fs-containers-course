import { UserModel } from '../models/User.js'
import { loginSchema, registerSchema } from '../schemas/authSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'

export const registerUser = async (req, res) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET
        const { username, email, password } = registerSchema.parse(req.body)
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const isFirstUser = (await UserModel.countDocuments()) === 0

        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: isFirstUser ? true : false,
        })

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            JWT_SECRET,
            {
                expiresIn: '1h',
            }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000,
        })
            .status(201)
            .json({
                message: 'Usuario registrado con exito',
            })
    } catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json(error.issues.map((issue) => ({ message: issue.message })))
        }
        res.status(500).json({
            message: 'Error al registrar usuario',
            error: error,
        })
    }
}

export const profile = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } catch (error) {
        res.status(401).json({ message: 'Token invalido' })
    }
}

export const loginUser = async (req, res) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET
        const { email, password } = loginSchema.parse(req.body)
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'Credenciales Invalidas' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales Invalidas' })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            {
                expiresIn: '1h',
            }
        )

        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000,
        })
            .status(200)
            .json({
                message: 'Usuario logueado con exito',
            })
    } catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json(error.issues.map((issue) => ({ message: issue.message })))
        }
        res.status(500).json({
            message: 'Error al iniciar sesion',
            error: error,
        })
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })
        .status(200)
        .json({
            message: 'Usuario deslogueado con exito',
        })
}
