// -- pillLogsRoutes --
import express from 'express'
import { PillLogsController } from '../controllers/pillLogsController'

const router = express.Router()

// Osnovne CRUD operacije + korisnički i dnevni logovi
router.get('/', PillLogsController.getAllLogs)                          // Svi logovi
router.get('/:id', PillLogsController.getLogById)                       // Jedan log po ID
router.get('/user/:id', PillLogsController.getLogsByUser)              // Svi logovi jednog korisnika
router.get('/user/:id/today', PillLogsController.getTodayLogsByUser)   // Dnevni logovi korisnika
router.post('/', PillLogsController.createLog)                          // Dodavanje novog loga
router.put('/:id', PillLogsController.updateLog)                        // Izmena loga
router.delete('/:id', PillLogsController.deleteLog)                     // Brisanje loga

export default router
