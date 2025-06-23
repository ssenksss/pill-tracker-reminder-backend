import express from 'express'
import { PillsController } from '../controllers/pillsController'

const router = express.Router()

router.get('/', PillsController.getAllPills)
router.get('/reminders', PillsController.getTodaysReminders)
router.get('/:id', PillsController.getPillById)
router.post('/', PillsController.createPill)
router.put('/:id', PillsController.updatePill)
router.delete('/:id', PillsController.deletePill)
router.get('/with-last-taken', PillsController.getPillsWithLastTaken);

export default router
