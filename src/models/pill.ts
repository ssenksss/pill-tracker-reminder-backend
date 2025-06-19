import { Router } from 'express'
import pool from '../config/db'

const router = Router()


router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, dosage, frequency, time, note, image FROM pills'
        )
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})


router.post('/', async (req, res) => {
    try {
        const { name, dosage, frequency, time, note, image } = req.body

        const [result] = await pool.execute(
            `INSERT INTO pills (name, dosage, frequency, time, note, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [name, dosage, frequency, time, note, image]
        )

        res.status(201).json({
            id: (result as any).insertId,
            name,
            dosage,
            frequency,
            time,
            note,
            image,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, dosage, frequency, time, note, image } = req.body

        const [result] = await pool.execute(
            `UPDATE pills SET name = ?, dosage = ?, frequency = ?, time = ?, note = ?, image = ? WHERE id = ?`,
            [name, dosage, frequency, time, note, image, id]
        )

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'Pill not found' })
        }

        res.json({ id, name, dosage, frequency, time, note, image })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [result] = await pool.execute('DELETE FROM pills WHERE id = ?', [id])

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'Pill not found' })
        }

        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
