import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import createConnection from '../config/dbConnection.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file located in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })


const register = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        const connection = await createConnection()

        // Check if the user already exists
        const [rows] = await connection.execute('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email])

        if (rows.length) {
            return res.status(409).json({ msg: 'This user is already registered!' })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insert the new user
        await connection.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        )

        // Return a success message
        res.status(201).json({ msg: 'Registered!' })

    } catch (err) {
        console.error('Registration error:', err)
        return res.status(500).json({ msg: 'Internal server error' })
    }
}

const login = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        const connection = await createConnection()

        // Vérifier si l'utilisateur existe
        const [rows] = await connection.execute('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email])

        if (rows.length === 0) {
            return res.status(401).json({ msg: 'Invalid email!' })  // Utilisateur non trouvé
        }

        const user = rows[0]

        // Comparer le mot de passe fourni avec le mot de passe haché stocké
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid password!' })  // Mot de passe incorrect
        }


        // Générer un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        )

         // Envoyer le token dans un cookie HTTP-only
         res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        // Connexion réussie, renvoyer un message de succès
        res.status(200).json({ msg: 'Logged in!' })

    } catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({ msg: 'Internal server error' })
    }
}

const logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ msg: 'Logout successful' });
};


export { register, login, logout }