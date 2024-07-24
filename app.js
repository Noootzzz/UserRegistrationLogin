import express from 'express'
import mysql from 'mysql2'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// Import routes
import authRoutes from './routes/auth.js'
import pagesRoutes from './routes/pages.js'


// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({
    path: './.env'
})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect((error) => {
    if (error) throw error
    console.log(`APP DATABASE CONNEXION ===> OK`)
})

// Initialize express app
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Set up view engine
app.set('view engine', 'hbs')

// Routes
app.use('/', pagesRoutes)
app.use('/auth', authRoutes)

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`SERVER LISTENING AT http://localhost:${process.env.PORT} ===> OK`)
})
