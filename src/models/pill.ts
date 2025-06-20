import { Router } from 'express'
import pool from '../config/db'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, description, dosage, frequency, time, note, image, count FROM pills'
        )
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})


router.post('/', async (req, res) => {
    try {
        const { name, description, dosage, frequency, time, note, image, count } = req.body

        const [result] = await pool.execute(
            `INSERT INTO pills (name, description, dosage, frequency, time, note, image, count)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, dosage, frequency, time, note, image, count]
        )

        res.status(201).json({
            id: (result as any).insertId,
            name,
            description,
            dosage,
            frequency,
            time,
            note,
            image,
            count,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
})


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, dosage, frequency, time, note, image, count } = req.body;

        const [result] = await pool.execute(
            `UPDATE pills SET name = ?, description = ?, dosage = ?, frequency = ?, time = ?, note = ?, image = ?, count = ? WHERE id = ?`,
            [name, description, dosage, frequency, time, note, image, count, id]
        );

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'Pill not found' });
        }

        res.json({ id, name, description, dosage, frequency, time, note, image, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

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