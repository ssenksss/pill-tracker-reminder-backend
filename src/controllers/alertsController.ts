import { Request, Response } from 'express'
import pool from '../config/db'

export class AlertsController {
    static async getTodaysAlerts(req: Request, res: Response) {
        try {
            const today = new Date()
            const year = today.getFullYear()
            const month = String(today.getMonth() + 1).padStart(2, '0')
            const day = String(today.getDate()).padStart(2, '0')
            const todayDate = `${year}-${month}-${day}`

            const [rows]: any = await pool.query(
                `SELECT p.id, p.name, p.dosage, p.time, p.note, p.image, p.count,
                    pl.status, pl.taken_at
             FROM pills p
                      LEFT JOIN pill_logs pl
                                ON p.id = pl.pill_id AND pl.taken_at = (
                                    SELECT MAX(taken_at)
                                    FROM pill_logs
                                    WHERE pill_id = p.id AND DATE(taken_at) = ?
                                )
             WHERE p.time IS NOT NULL`,
                [todayDate]
            )

            res.json(rows)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Greška u alerts endpointu', error })
        }
    }

}
