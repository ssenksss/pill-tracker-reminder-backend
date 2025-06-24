// --server --
import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from '../config/db'  // Import konekcije sa bazom podataka (MySQL/MariaDB)

dotenv.config() // Učitavanje .env fajla za pristup environment varijablama

// Definisanje TypeScript interfejsa za Pill (lek)
interface Pill {
    id: number                    // Jedinstveni ID leka
    name: string                  // Naziv leka
    description: string           // Opis leka
    time: string                  // Vreme uzimanja leka u formatu HH:mm
    image: string                 // Naziv slike leka (putanja ili ime fajla)
    dosage?: string               // Doza leka (opciono)
    count?: number                // Broj preostalih doza leka (opciono)
    lastTaken?: string            // Datum i vreme poslednjeg uzimanja leka (opciono)
    refillReminderCount?: number  // Broj doza do podsećanja na dopunu leka (opciono)
    interactions?: string[]       // Lista mogućih interakcija sa drugim supstancama (opciono)
}

const app = express()  // Kreiranje Express aplikacije
app.use(cors())        // Omogućavanje CORS-a za frontend aplikaciju (za cross-origin zahteve)
app.use(express.json()) // Middleware za parsiranje JSON tela zahteva

// Hardkodirani podaci za lekove (za potrebe razvoja i testiranja)
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

// Ruta za dodavanje logova uzimanja leka u bazu podataka
app.post('/api/pill_logs', async (req: Request, res: Response) => {
    try {
        // Izvlačenje podataka iz tela zahteva
        const { pill_id, taken_at } = req.body

        // SQL upit za ubacivanje novog zapisa u tabelu pill_logs
        // Status se postavlja na 'uzeto' (što označava da je lek uzet)
        const [result] = await pool.query(
            `INSERT INTO pill_logs (pill_id, taken_at, status) VALUES (?, ?, 'uzeto')`,
            [pill_id, taken_at]
        )

        // Dohvatanje ID novounetog loga da bi ga vratili klijentu
        const insertId = (result as any).insertId

        // SQL upit za vraćanje podataka o kreiranom logu po ID-u
        const [rows] = (await pool.query('SELECT * FROM pill_logs WHERE id = ?', [insertId])) as [
            any[],
            any
        ]

        // Slanje odgovora sa podacima o kreiranom logu
        res.json({ log: rows[0] })
    } catch (error) {
        console.error(error)
        // Slanje greške servera ukoliko dođe do problema
        res.status(500).json({ error: 'Server error' })
    }
})

// Ruta za dobijanje dnevnih alerts (obaveštenja) o lekovima i njihovim logovima za taj dan
app.get('/api/alerts/today', async (req: Request, res: Response) => {
    try {
        // Dobijanje trenutnog datuma u formatu yyyy-mm-dd
        const today = new Date().toISOString().slice(0, 10)

        // SQL upit za dobijanje lekova sa njihovim logovima za današnji datum
        // LEFT JOIN omogućava da dobijemo i lekove koji možda nemaju log za danas
        // Filtrira se da lekovi moraju imati definisano vreme uzimanja (p.time IS NOT NULL)
        const [rows]: any = await pool.query(
            `SELECT p.id, p.name, p.dosage, p.time, p.note, p.image, p.count,
                    pl.status, pl.taken_at
             FROM pills p
             LEFT JOIN pill_logs pl ON p.id = pl.pill_id AND DATE(pl.taken_at) = ?
             WHERE p.time IS NOT NULL`,
            [today]
        )

        // Slanje rezultata klijentu kao JSON niz
        res.json(rows)
    } catch (error) {
        console.error(error)
        // Slanje odgovora sa greškom u slučaju problema sa bazom ili logikom
        res.status(500).json({ message: 'Greška u alerts endpointu', error })
    }
})

// Pokretanje servera na portu iz environment varijable ili 3000 po default-u
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
