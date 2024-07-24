import express from 'express'
import { register, login, logout } from '../controllers/authController.js'

const router = express.Router()

// Routes
router.post('/register', register)
router.post('/login', login)
router.get('/logout')

export default router