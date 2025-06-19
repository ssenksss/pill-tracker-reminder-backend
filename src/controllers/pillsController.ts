import { Request, Response } from 'express';
import pool from '../config/db';
import { Pill } from '../models/pill';

export class PillsController {
    static async getAllPills(req: Request, res: Response) {
        try {
            const [rows] = await pool.query('SELECT * FROM pills');
            console.log('Lekovi iz baze:', rows);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata lekova', error });
        }
    }

    static async getPillById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [rows]: any = await pool.query('SELECT * FROM pills WHERE id = ?', [id]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Lek nije pronađen' });
            }

            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata leka', error });
        }
    }

    static async createPill(req: Request, res: Response) {
        try {
            const pill: Pill = req.body;
            const [result]: any = await pool.query(
                'INSERT INTO pills (user_id, name, dosage, frequency, time, note) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    pill.user_id || null,
                    pill.name,
                    pill.dosage || null,
                    pill.frequency || null,
                    pill.time || null,
                    pill.note || null,
                ],
            );

            res.status(201).json({ message: 'Lek dodat', id: result.insertId });
        } catch (error) {
            console.error('GREŠKA u createPill:', error);
            res.status(500).json({ message: 'Greška prilikom dodavanja leka', error });
        }
    }



    static async updatePill(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pill: Pill = req.body;

            const [result]: any = await pool.query(
                'UPDATE pills SET user_id = ?, name = ?, dosage = ?, frequency = ?, time = ?, note = ? WHERE id = ?',
                [
                    pill.user_id || null,
                    pill.name,
                    pill.dosage || null,
                    pill.frequency || null,
                    pill.time || null,
                    pill.note || null,
                    id,
                ],
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Lek nije pronađen za izmenu' });
            }

            res.json({ message: 'Lek izmenjen' });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom izmene leka', error });
        }
    }

    static async deletePill(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const [result]: any = await pool.query('DELETE FROM pills WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Lek nije pronađen za brisanje' });
            }

            res.json({ message: 'Lek obrisan' });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom brisanja leka', error });
        }
    }
}
