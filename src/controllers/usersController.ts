import { Request, Response } from 'express';
import pool from '../config/db';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';

dotenv.config();

export class UsersController {
    static async register(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { email, password } = req.body;
            const [existingUsers]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUsers.length > 0) return res.status(400).json({ message: 'Korisnik sa ovim emailom već postoji' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const [result]: any = await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

            res.status(201).json({ message: 'Korisnik je uspešno registrovan', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom registracije korisnika', error });
        }
    }

    static async login(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { email, password } = req.body;
            const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (users.length === 0) return res.status(400).json({ message: 'Pogrešan email ili lozinka' });

            const user = users[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Pogrešan email ili lozinka' });

            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            res.json({ token, userId: user.id });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom prijave', error });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const [rows] = await pool.query('SELECT id, email, created_at FROM users');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata korisnika', error });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Korisnik nije pronađen' });
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata korisnika', error });
        }
    }

    static async createUser(req: Request, res: Response) {
        try {
            const user: User = req.body;
            const [result]: any = await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [user.email, user.password]);
            res.status(201).json({ message: 'Korisnik dodat', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dodavanja korisnika', error });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user: User = req.body;
            const [result]: any = await pool.query('UPDATE users SET email = ?, password = ? WHERE id = ?', [user.email, user.password, id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Korisnik nije pronađen za izmenu' });
            res.json({ message: 'Korisnik izmenjen' });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom izmene korisnika', error });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [result]: any = await pool.query('DELETE FROM users WHERE id = ?', [id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Korisnik nije pronađen za brisanje' });
            res.json({ message: 'Korisnik obrisan' });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom brisanja korisnika', error });
        }
    }
}
