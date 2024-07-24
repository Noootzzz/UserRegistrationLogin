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

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, result) => {
            if (error) throw error
            try {
                return res.redirect('/login')
            } catch (error) {
                console.error(error)
                return res.render('register', console.log(`Error register: ${error}`))
            }
        })
    })
}

// Login function
const login = (req, res) => {
    const { email, password } = req.body

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) throw error

        if (result.length <= 0) {
            return res.render('login', {
                message: 'Email or password is incorrect!'
            })
        }

        const user = result[0]

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.render('login', {
                message: 'Email or password is incorrect!'
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        })

        return res.redirect('/home')
    })
}

// Logout function
const logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0) // Réinitialiser le cookie
    });
    res.redirect('/login')
};

export { register, login, logout }
