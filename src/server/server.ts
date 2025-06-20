import express, { Request, Response } from 'express'
import cors from 'cors'

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
        interactions: ['Alcohol', 'Warfarin']
    }
]

app.get('/api/pills', (req: Request, res: Response) => {
    res.json(pills)
})

app.get('/api/pills/:id', (req: Request, res: Response) => {
    const pill = pills.find(p => p.id === parseInt(req.params.id))
    if (pill) res.json(pill)
    else res.status(404).json({ message: 'Pill not found' })
})

app.post('/api/pills', (req: Request, res: Response) => {
    const newPill: Pill = {
        id: pills.length + 1,
        ...req.body
    }
    pills.push(newPill)
    res.status(201).json(newPill)
})

app.put('/api/pills/:id', (req: Request, res: Response) => {
    const index = pills.findIndex(p => p.id === parseInt(req.params.id))
    if (index !== -1) {
        pills[index] = { ...pills[index], ...req.body }
        res.json(pills[index])
    } else {
        res.status(404).json({ message: 'Pill not found' })
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
