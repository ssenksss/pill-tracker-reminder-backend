"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
dotenv_1.default.config();
class UsersController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { email, password } = req.body;
                const [existingUsers] = yield db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
                if (existingUsers.length > 0) {
                    return res.status(400).json({ message: 'Korisnik sa ovim emailom već postoji' });
                }
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                const [result] = yield db_1.default.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
                res.status(201).json({ message: 'Korisnik je uspešno registrovan', id: result.insertId });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom registracije korisnika', error });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { email, password } = req.body;
                const [users] = yield db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
                if (users.length === 0) {
                    return res.status(400).json({ message: 'Pogrešan email ili lozinka' });
                }
                const user = users[0];
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Pogrešan email ili lozinka' });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token, userId: user.id });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom prijave', error });
            }
        });
    }
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT id, email, created_at FROM users');
                res.json(rows);
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dohvata korisnika', error });
            }
        });
    }
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [rows] = yield db_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Korisnik nije pronađen' });
                }
                res.json(rows[0]);
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dohvata korisnika', error });
            }
        });
    }
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const [result] = yield db_1.default.query('INSERT INTO users (email, password) VALUES (?, ?)', [user.email, user.password]);
                res.status(201).json({ message: 'Korisnik dodat', id: result.insertId });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dodavanja korisnika', error });
            }
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = req.body;
                const [result] = yield db_1.default.query('UPDATE users SET email = ?, password = ? WHERE id = ?', [user.email, user.password, id]);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Korisnik nije pronađen za izmenu' });
                }
                res.json({ message: 'Korisnik izmenjen' });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom izmene korisnika', error });
            }
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [result] = yield db_1.default.query('DELETE FROM users WHERE id = ?', [id]);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Korisnik nije pronađen za brisanje' });
                }
                res.json({ message: 'Korisnik obrisan' });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom brisanja korisnika', error });
            }
        });
    }
}
exports.UsersController = UsersController;
