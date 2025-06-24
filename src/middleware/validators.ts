// -- validators --
import { body } from 'express-validator'

// Validacija registracije korisnika
export const userRegisterValidation = [
    body('email')
        .isEmail()
        .withMessage('Email nije validan'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Lozinka mora imati najmanje 6 karaktera'),
]

// Validacija login podataka
export const userLoginValidation = [
    body('email')
        .isEmail()
        .withMessage('Email nije validan'),
    body('password')
        .exists()
        .withMessage('Lozinka je obavezna'),
]
