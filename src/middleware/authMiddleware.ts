// -- authMiddleware --
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Tip za očekivani sadržaj tokena
interface JwtPayload {
    userId: number
    email: string
}

// Middleware funkcija za proveru JWT tokena
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Preuzima token iz zaglavlja Authorization: Bearer <token>
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // izdvajanje tokena

    if (!token) {
        return res.status(401).json({ message: 'Nema tokena, pristup odbijen' })
    }

    // Proverava validnost tokena
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token nije validan' })
        }

        // Ako je token ispravan, dodaj korisnika u zahtev
        ;(req as any).user = user as JwtPayload

        next() // Prelazi na sledeći middleware ili rutu
    })
}
