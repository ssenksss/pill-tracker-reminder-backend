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
app.use(morgan('combined'))

app.use('/api/pills', pillsRoutes)
app.use('/api/pill-logs', pillLogsRoutes)

type AuthenticatedRequest = Request & { user?: { id: number } }

async function testDBConnection() {
    try {
        await pool.query('SELECT 1')
        console.log('Database connected successfully')
    } catch (error) {
        console.error('Database connection failed:', error)
    }
}

app.get('/today', async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthenticatedRequest

        if (!authReq.user) {
            return res.status(401).json({ error: 'Unauthorized, user not found in request' })
        }

        const today = new Date().toISOString().split('T')[0]

        const requestedTimes: string[] = []

        let query = `
      SELECT p.*, pl.status
      FROM pills p
      LEFT JOIN pill_logs pl
        ON pl.pill_id = p.id
        AND DATE(pl.taken_at) = ?
      WHERE p.user_id = ?
    `

        const params: (string | number)[] = [today, authReq.user.id]

        if (requestedTimes.length > 0) {
            query += ` AND TIME(p.time) IN (${requestedTimes.map(() => '?').join(',')})`
            params.push(...requestedTimes)
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params)

        res.json({ alerts: rows })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

app.post('/pill_logs', async (req: Request, res: Response) => {
    try {
        const { pill_id, taken_at } = req.body

        if (!pill_id || !taken_at) {
            return res.status(400).json({ error: 'pill_id and taken_at are required' })
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO pill_logs (pill_id, taken_at, status) VALUES (?, ?, 'uzeto')`,
            [pill_id, taken_at]
        )

        const insertId = result.insertId

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pill_logs WHERE id = ?', [insertId])

        res.status(201).json({ log: rows[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    await testDBConnection()
})
