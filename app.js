import express from 'express'
import mysql from 'mysql2'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import pagesRoutes from './routes/pages.js'
import authRoutes from './routes/auth.js'



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

const app = express()

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

// PARSE URL ENCODED BODIES
app.use(express.urlencoded({ extended: false }))
// PARSE JSON BODIES
app.use(express.json())

app.set('view engine', 'hbs')

//DEFINE ROUTES
app.use('/', pagesRoutes)
app.use('/auth', authRoutes)

app.listen(process.env.PORT, () => {
    console.log(`SERVER LISTENING AT http://localhost:${process.env.PORT} ===> OK`)
})
