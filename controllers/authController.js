import mysql from 'mysql2'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Database connection setup
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

// Connect to the database
db.connect((error) => {
    if (error) throw error
    console.log('AUTHCONTROLLER DATABASE CONNECTION ===> OK')
})

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET

// Register function
const register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) throw error

        if (result.length > 0) {
            return res.render('register', {
                message: 'That email is already used!'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match!'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8)

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, result) => {
            if (error) throw error
            return res.render('home') // Redirect to home or login page
        })
    })
}

// Login function
const login = (req, res) => {
    const { email, password } = req.body

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) throw error

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const user = result[0]
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        )

        res.cookie("token", token, {
            httpOnly: true,
        })

        return res.redirect('/home')
    })
}

export { register, login }
