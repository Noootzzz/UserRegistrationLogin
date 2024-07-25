import { check } from 'express-validator'

const registerValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    // Uncomment if you want to validate confirmPassword
    // check('confirmPassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password),
]

export default registerValidation