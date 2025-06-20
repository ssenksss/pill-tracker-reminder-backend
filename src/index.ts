import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import usersRoutes from './routes/usersRoutes';
import pillsRoutes from './routes/pillsRoutes';
import pillLogsRoutes from './routes/pillLogsRoutes';

import pool from './config/db';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/api/users', usersRoutes);
app.use('/api/pills', pillsRoutes);
app.use('/api/pill-logs', pillLogsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;


async function testDBConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await testDBConnection();
});