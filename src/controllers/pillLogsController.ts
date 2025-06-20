import { Request, Response } from 'express'
import pool from '../config/db'
import { PillLog } from '../models/pillLog'
import { ResultSetHeader } from 'mysql2'

export class PillLogsController {
    static async getAllLogs(req: Request, res: Response) {
        try {
            const [rows] = await pool.query('SELECT * FROM pill_logs')
            res.json(rows)
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata logova', error })
        }
    }

    static async getLogById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const [rows]: any = await pool.query('SELECT * FROM pill_logs WHERE id = ?', [id])

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Log nije pronađen' })
            }

            res.json(rows[0])
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata loga', error })
        }
    }

    static async getLogsByUser(req: Request, res: Response) {
        const { id } = req.params // userId
        try {
            const [rows] = await pool.query(
                `SELECT pl.id, pl.taken_at,
                        CONCAT(UPPER(LEFT(pl.status, 1)), LOWER(SUBSTRING(pl.status, 2))) as status,
                        p.name
                 FROM pill_logs pl
                          JOIN pills p ON pl.pill_id = p.id
                 WHERE pl.user_id = ?
                 ORDER BY pl.taken_at DESC`,
                [id]
            )

            res.json(rows)
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dohvata logova korisnika', error })
        }
    }

    static async createLog(req: Request, res: Response) {
        try {
            const log: PillLog = req.body

            if (!log.user_id || !log.pill_id || !log.status) {
                return res.status(400).json({ message: 'Nedostaju obavezni podaci' })
            }

            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO pill_logs (user_id, pill_id, status)
                 VALUES (?, ?, ?)`,
                [log.user_id, log.pill_id, log.status]
            )

            res.status(201).json({ message: 'Log dodat', id: result.insertId })
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom dodavanja loga', error })
        }
    }

    static async updateLog(req: Request, res: Response) {
        try {
            const { id } = req.params
            const log: PillLog = req.body

            const [result] = await pool.query<ResultSetHeader>(
                'UPDATE pill_logs SET pill_id = ?, taken_at = ?, status = ? WHERE id = ?',
                [log.pill_id, log.taken_at, log.status, id]
            )

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Log nije pronađen za izmenu' })
            }

            res.json({ message: 'Log izmenjen' })
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom izmene loga', error })
        }
    }

    static async deleteLog(req: Request, res: Response) {
        try {
            const { id } = req.params
            const [result] = await pool.query<ResultSetHeader>('DELETE FROM pill_logs WHERE id = ?', [id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Log nije pronađen za brisanje' })
            }

            res.json({ message: 'Log obrisan' })
        } catch (error) {
            res.status(500).json({ message: 'Greška prilikom brisanja loga', error })
        }
    }
}
