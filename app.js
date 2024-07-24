import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: './.env'
})

const app = express()

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE //.env value
})

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs')

db.connect((error) => {
    if (error) throw error
    console.log(`DATABASE CONNEXION ===> OK`)
})

app.get('/', (req, res) => {
    // res.send("<h1>Home</h1>")
    res.render("index")
})

app.listen(process.env.PORT, () => {
    console.log(`SERVER ON PORT: ${process.env.PORT} ===> OK`)
})