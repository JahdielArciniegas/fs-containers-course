import express from 'express'
import {
    registerUser,
    profile,
    loginUser,
    logoutUser,
} from '../controllers/authControllers.js'

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/profile', profile)

router.post('/logout', logoutUser)

export default router
