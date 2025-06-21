import { body } from 'express-validator'

export const userRegisterValidation = [
    body('email').isEmail().withMessage('Email nije validan'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Lozinka mora imati najmanje 6 karaktera'),
]

export const userLoginValidation = [
    body('email').isEmail().withMessage('Email nije validan'),
    body('password').exists().withMessage('Lozinka je obavezna'),
]
