// -- alerts --
import express from 'express'
import { AlertsController } from '../controllers/alertsController'

const router = express.Router()

// GET /api/alerts/today – vraća sve alarme za današnji dan
router.get('/today', AlertsController.getTodaysAlerts)

export default router
