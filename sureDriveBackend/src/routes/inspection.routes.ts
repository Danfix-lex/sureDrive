import { Router } from 'express';
import { getInspections, getInspectionById, createInspection, updateInspection, deleteInspection, getInspectionHistory } from '../controllers/inspection.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getInspections);
router.get('/:id', authenticate, getInspectionById);
router.post('/', authenticate, createInspection);
router.put('/:id', authenticate, updateInspection);
router.delete('/:id', authenticate, deleteInspection);
router.get('/history/plate', authenticate, getInspectionHistory);

export default router; 