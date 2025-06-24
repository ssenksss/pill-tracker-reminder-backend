// --db--
import mysql from 'mysql2/promise' // Uvoz mysql2 biblioteke sa podrškom za async/await
import dotenv from 'dotenv'

dotenv.config() // Učitavanje .env fajla radi pristupa konfiguraciji baze

// Kreiranje pool konekcije – omogućava više istovremenih konekcija
const pool = mysql.createPool({
    host: process.env.DB_HOST, // npr. 'localhost'
    user: process.env.DB_USER, // korisničko ime baze
    password: process.env.DB_PASSWORD, // lozinka baze
    database: process.env.DB_NAME, // naziv baze
    port: Number(process.env.DB_PORT) || 3306, // port baze, podrazumevano 3306
    waitForConnections: true, // čeka konekciju ako su sve zauzete
    connectionLimit: 10, // maksimalno 10 konekcija istovremeno
    queueLimit: 0, // neograničeno čekanje konekcija
})

export default pool // Izvoz pool-a za korišćenje u drugim delovima aplikacije
