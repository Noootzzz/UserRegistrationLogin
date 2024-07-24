import jwt from 'jsonwebtoken'

// Middleware to protect routes
const protect = (req, res, next) => {
    const token = req.cookies.jwt
    if (!token) {
        return res.redirect('/login')
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/login')
        }
        req.user = decoded.id
        next()
    })
}

export default protect