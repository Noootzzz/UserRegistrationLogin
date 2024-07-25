import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import createConnection from '../config/dbConnection.js'

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
        res.status(201).json({ msg: 'User registered successfully!' })

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

        // Connexion réussie, renvoyer un message de succès
        res.status(200).json({ msg: 'Login successful!' })

    } catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({ msg: 'Internal server error' })
    }
}


export { register, login }