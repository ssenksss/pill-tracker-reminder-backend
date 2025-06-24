// -- pillsRoutes --
import express from 'express'
import { PillsController } from '../controllers/pillsController'

const router = express.Router()

router.get('/', PillsController.getAllPills)                             // Lista svih lekova
router.get('/reminders', PillsController.getTodaysReminders)            // Dnevni podsetnici
router.get('/:id', PillsController.getPillById)                          // Detalji jednog leka
router.post('/', PillsController.createPill)                             // Dodavanje leka
router.put('/:id', PillsController.updatePill)                           // Izmena leka
router.delete('/:id', PillsController.deletePill)                        // Brisanje leka
router.get('/with-last-taken', PillsController.getPillsWithLastTaken)   // Lekovi sa poslednjim unosom

export default router
