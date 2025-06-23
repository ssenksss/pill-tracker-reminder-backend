import { Request, Response } from 'express'
import pool from '../config/db'

export class PillsController {
    static async getAllPills(req: Request, res: Response) {
        try {
            const [rows] = await pool.query('SELECT * FROM pills')
            res.json(rows)
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata lekova', error })
        }
    }
    static async getPillsWithLastTaken(req: Request, res: Response) {
        try {
            const userId = req.query.user_id ? Number(req.query.user_id) : null;
            if (!userId) {
                return res.status(400).json({ message: 'Nedostaje user_id u query' });
            }

            const [rows]: any = await pool.query(
                `SELECT p.*,
              pl.taken_at AS last_taken,
              pl.status AS last_status
       FROM pills p
       LEFT JOIN pill_logs pl ON pl.pill_id = p.id
                              AND pl.taken_at = (
                                SELECT MAX(taken_at)
                                FROM pill_logs
                                WHERE pill_id = p.id AND status = 'uzeto'
                              )
       WHERE p.user_id = ?`,
                [userId]
            );

            res.json(rows);
        } catch (error) {
            console.error('Greška u getPillsWithLastTaken:', error);
            res.status(500).json({ message: 'Greška prilikom dohvata podataka', error });
        }
    }

    static async getPillById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const [rows]: any = await pool.query('SELECT * FROM pills WHERE id = ?', [id])

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Lek nije pronađen' })
            }

            res.json(rows[0])
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata leka', error })
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
                    JSON.stringify(pill.time || []),
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
                    JSON.stringify(pill.time || []),
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
            const { id } = req.params

            const [result]: any = await pool.query('DELETE FROM pills WHERE id = ?', [id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Lek nije pronađen za brisanje' })
            }

            res.json({ message: 'Lek obrisan' })
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom brisanja leka', error })
        }
    }

    static async getTodaysReminders(req: Request, res: Response) {
        try {

            const userId = req.query.user_id ? Number(req.query.user_id) : null;
            if (!userId) {
                return res.status(400).json({ message: 'Nedostaje user_id u query' });
            }

            const [rows]: any = await pool.query(
                `SELECT id, user_id, name, description, dosage, frequency, time, note, image, count
             FROM pills
             WHERE user_id = ?`,
                [userId]
            )

            const today = new Date();
            const nowMinutes = today.getHours() * 60 + today.getMinutes();

            const filtered = rows.filter((pill: any) => {
                if (!pill.time) return false;
                let times: string[] = [];
                try {
                    times = JSON.parse(pill.time);
                } catch {
                    return false;
                }

                return times.some(timeStr => {
                    const [h, m] = timeStr.split(':').map(Number);
                    if (isNaN(h) || isNaN(m)) return false;
                    const termMinutes = h * 60 + m;
                    return termMinutes >= nowMinutes && termMinutes <= nowMinutes + 30;
                });
            });

            res.json(filtered);
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata dnevnih podsetnika', error });
        }
    }


}