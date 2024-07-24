import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { logout } from '../controllers/authController.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})
router.get('/register', (req, res) => {
    res.render('register')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/logout', logout, (req, res) => {
    res.redirect('login')
})
router.get('/home', protect, (req, res) => {
    res.render('home')
})

export default router