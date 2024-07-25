import { config } from 'dotenv'
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import createConnection from './config/dbConnection.js'
import userRouter from './routes/userRoutes.js'
import authenticateToken from './middleware/authMiddleware.js'

// Charger les variables d'environnement .env
config()

// Créer une application expressjs
const app = express()

// Middleware
app.use(express.json())  // Pour traiter les JSON dans le corps de la requête
app.use(bodyParser.json())  // Pour traiter les données JSON
app.use(bodyParser.urlencoded({ extended: true }))  // Pour traiter les données URL-encodées
app.use(cors())  // Pour permettre les requêtes cross-origin
app.use(cookieParser())

// Connexion à la base de données
createConnection().catch(err => {
    console.error('Erreur de connexion à la base de données:', err.message)
    process.exit(1)  // Arrêtez le serveur si la connexion échoue
})

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static(path.resolve('public')))

// Utiliser les routes API
app.use('/api', userRouter)

// Route pour le formulaire d'inscription
app.get('/reg', (req, res) => {
    res.sendFile(path.resolve('views/register.html'))
})
// Route pour le formulaire de connexion
app.get('/log', (req, res) => {
    res.sendFile(path.resolve('views/login.html'))
})
// Route pour la page d'accueil
app.get('/home', authenticateToken, (req, res) => {
    res.sendFile(path.resolve('views/home.html'))
})

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500).send('Erreur interne du serveur.')
})

app.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`)
})