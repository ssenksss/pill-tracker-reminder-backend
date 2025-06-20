import { Request, Response } from 'express';
import pool from '../config/db';

export class PillsController {
    static async getAllPills(req: Request, res: Response) {
        try {
            const [rows] = await pool.query('SELECT * FROM pills');
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
            const pill = req.body;

            const [result]: any = await pool.query(
                `INSERT INTO pills (user_id, name, description, dosage, frequency, time, note, image, count)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    pill.user_id || null,
                    pill.name,
                    pill.description || null,
                    pill.dosage || null,
                    pill.frequency || null,
                    pill.time || null,
                    pill.note || null,
                    pill.image || null,
                    pill.count || null,
                ]
            );

            res.status(201).json({ message: 'Lek dodat', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dodavanja leka', error });
        }
    }

    static async updatePill(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pill = req.body;

            const [result]: any = await pool.query(
                `UPDATE pills
                 SET user_id = ?, name = ?, description = ?, dosage = ?, frequency = ?, time = ?, note = ?, image = ?, count = ?
                 WHERE id = ?`,
                [
                    pill.user_id || null,
                    pill.name,
                    pill.description || null,
                    pill.dosage || null,
                    pill.frequency || null,
                    pill.time || null,
                    pill.note || null,
                    pill.image || null,
                    pill.count || null,
                    id,
                ]
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
    static async getTodaysReminders(req: Request, res: Response) {
        try {

            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');


            const startOfDay = `${year}-${month}-${day} 00:00:00`;
            const endOfDay = `${year}-${month}-${day} 23:59:59`;

            const [rows]: any = await pool.query(
                `SELECT id, user_id, name, description, dosage, frequency, time, note, image, count
             FROM pills
             WHERE time BETWEEN ? AND ?`,
                [startOfDay, endOfDay]
            );

            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata dnevnih podsetnika', error });
        }
    }

}