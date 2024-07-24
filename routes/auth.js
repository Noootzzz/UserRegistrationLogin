import express from 'express'
import { register, login } from '../controllers/authController.js'
import authenticateToken from '../middleware/authMiddleware.js'

const router = express.Router()

// Routes
router.post('/register', register)
router.post('/login', login)
router.get('/home', authenticateToken)

export default router