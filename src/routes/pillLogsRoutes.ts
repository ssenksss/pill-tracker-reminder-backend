// src/routes/pillLogsRoutes.ts
import express from 'express';
import { PillLogsController } from '../controllers/pillLogsController';

const router = express.Router();

router.get('/', PillLogsController.getAllLogs);
router.get('/:id', PillLogsController.getLogById);
router.get('/user/:id', PillLogsController.getLogsByUser);
router.post('/', PillLogsController.createLog);
router.put('/:id', PillLogsController.updateLog);
router.delete('/:id', PillLogsController.deleteLog);

export default router;
