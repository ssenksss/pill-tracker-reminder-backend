import express from 'express';
import { PillsController } from '../controllers/pillsController';

const router = express.Router();

router.get('/', PillsController.getAllPills);
router.get('/:id', PillsController.getPillById);
router.post('/', PillsController.createPill);
router.put('/:id', PillsController.updatePill);
router.delete('/:id', PillsController.deletePill);

export default router;