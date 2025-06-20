"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginValidation = exports.userRegisterValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userRegisterValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email nije validan'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Lozinka mora imati najmanje 6 karaktera'),
];
exports.userLoginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email nije validan'),
    (0, express_validator_1.body)('password').exists().withMessage('Lozinka je obavezna'),
];
