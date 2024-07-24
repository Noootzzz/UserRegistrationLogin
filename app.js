import express from 'express'
import mysql from 'mysql'
import dotenv from 'dotenv'

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

db.connect((error) => {
    if (error) throw error
    console.log(`DATABASE CONNEXION ===> OK`)
})

app.get('/', (req, res) => {
    res.send("<h1>Home</h1>")
})

app.listen(process.env.PORT, () => {
    console.log(`SERVER ON PORT: ${process.env.PORT} ===> OK`)
})