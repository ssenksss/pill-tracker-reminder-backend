import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from '../config/db'

dotenv.config()

interface Pill {
    id: number
    name: string
    description: string
    time: string
    image: string
    dosage?: string
    count?: number
    lastTaken?: string
    refillReminderCount?: number
    interactions?: string[]
}

const app = express()
app.use(cors())
app.use(express.json())


let pills: Pill[] = [
    {
        id: 1,
        name: 'Paracetamol',
        description: 'Pain reliever and fever reducer',
        time: '08:00',
        image: 'paracetamol.png',
        dosage: '500mg',
        count: 20,
        lastTaken: '2025-06-18T08:00:00Z',
        refillReminderCount: 5,
        interactions: ['Alcohol', 'Warfarin'],
    },
]


app.post('/api/pill_logs', async (req: Request, res: Response) => {
    try {
        const { pill_id, taken_at } = req.body

        const [result] = await pool.query(
            `INSERT INTO pill_logs (pill_id, taken_at, status) VALUES (?, ?, 'uzeto')`,
            [pill_id, taken_at]
        )

        const insertId = (result as any).insertId

        const [rows] = (await pool.query('SELECT * FROM pill_logs WHERE id = ?', [insertId])) as [
            any[],
            any
        ]

        res.json({ log: rows[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})


app.get('/api/alerts/today', async (req: Request, res: Response) => {
    try {
        const today = new Date().toISOString().slice(0, 10) // yyyy-mm-dd

        const [rows]: any = await pool.query(
            `SELECT p.id, p.name, p.dosage, p.time, p.note, p.image, p.count,
                    pl.status, pl.taken_at
             FROM pills p
             LEFT JOIN pill_logs pl ON p.id = pl.pill_id AND DATE(pl.taken_at) = ?
             WHERE p.time IS NOT NULL`,
            [today]
        )

        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Greška u alerts endpointu', error })
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
