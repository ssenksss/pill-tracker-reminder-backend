import express from 'express';
import { PillLogsController } from '../controllers/PillLogsController';

const router = express.Router();

router.get('/', PillLogsController.getAllLogs);
router.get('/:id', PillLogsController.getLogById);
router.post('/', PillLogsController.createLog);
router.put('/:id', PillLogsController.updateLog);
router.delete('/:id', PillLogsController.deleteLog);

export default router;
