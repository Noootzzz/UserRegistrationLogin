import express from 'express'
import { register, login, logout } from '../controllers/authController.js'

const router = express.Router()

// Auth routes
router.post('/register', register)
router.post('/login', login)
// Logout route
router.get('/logout')

export default router