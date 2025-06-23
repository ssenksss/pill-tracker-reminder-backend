import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import pool from './config/db'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import pillLogsRoutes from './routes/pillLogsRoutes'
import pillsRoutes from './routes/pillsRoutes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


app.use('/api/pills', pillsRoutes)
app.use('/api/pill-logs', pillLogsRoutes)


async function testDBConnection() {
    try {
        await pool.query('SELECT 1')
        console.log('✅ Database connected successfully')
    } catch (error) {
        console.error('❌ Database connection failed:', error)
    }
}


app.get('/api/pills/today', async (req: Request, res: Response) => {
    try {
        const userId = 1
        const today = new Date().toISOString().slice(0, 10)

        const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT p.*, pl.status AS todayStatus, pl.taken_at AS todayTakenAt
      FROM pills p
      LEFT JOIN pill_logs pl ON pl.pill_id = p.id AND DATE(pl.taken_at) = ?
      WHERE p.user_id = ?
    `, [today, userId])

        const pills = rows.map(row => ({
            id: row.id,
            name: row.name,
            dosage: row.dosage,
            note: row.note,
            time: row.time,
            count: row.count,
            image: row.image,
            description: row.description,
            todayLog: row.todayStatus ? {
                status: row.todayStatus,
                takenAt: row.todayTakenAt
            } : null
        }))

        res.json(pills)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})


app.post('/api/pill_logs', async (req: Request, res: Response) => {
    try {
        const { pill_id, user_id, status, taken_at } = req.body
        if (!pill_id || !user_id || !status) {
            return res.status(400).json({ error: 'pill_id, user_id and status are required' })
        }

        const takenAt = taken_at || new Date()

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO pill_logs (pill_id, user_id, taken_at, status)
       VALUES (?, ?, ?, ?)`,
            [pill_id, user_id, takenAt, status.toLowerCase()]
        )

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM pill_logs WHERE id = ?`,
            [result.insertId]
        )

        res.status(201).json({ log: rows[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/api/dashboard/today', async (req: Request, res: Response) => {
    try {
        const today = new Date().toISOString().slice(0, 10)

        const [todaysLogs] = await pool.query<RowDataPacket[]>(`
      SELECT pl.*, p.name
      FROM pill_logs pl
      JOIN pills p ON p.id = pl.pill_id
      WHERE DATE(pl.taken_at) = ?
      ORDER BY pl.taken_at ASC
    `, [today])

        const [allPills] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM pills
    `)

        res.json({ todaysLogs, allPills })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    await testDBConnection()
})
