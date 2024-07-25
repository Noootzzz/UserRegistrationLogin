import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file located in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

async function createConnection() {
  let dbConnection
  try {
    dbConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME
    })
    console.log(`Connected to database: ${DB_NAME}`)
  } catch (err) {
    console.error(`Error connecting to the database: ${err.message}`)
    throw err
  }
  return dbConnection
}

export default createConnection