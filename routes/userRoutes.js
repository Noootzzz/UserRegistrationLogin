import express from 'express'
import registerValidation from '../helpers/validation.js'
import { register, login, logout, getUserDatas } from '../controllers/userController.js'
import authenticateToken from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerValidation, register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/user', authenticateToken, getUserDatas)

export default router