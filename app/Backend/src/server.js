import express from 'express'
import { connectDB, disconnectDB } from './config/configdb.js'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import productsRoutes from './routes/productsRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cookie',
            'Set-Cookie',
        ],
        credentials: true,
    })
)
app.use(cookieParser())

const PORT = 3001

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartRoutes)

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch(() => {
        disconnectDB()
    })
