import express from 'express'
import { AlertsController } from '../controllers/alertsController'

const router = express.Router()

router.get('/today', AlertsController.getTodaysAlerts)

export default router
