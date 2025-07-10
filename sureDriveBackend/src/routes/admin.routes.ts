import { Router } from 'express';
import { createInspector } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Only admin can create inspectors
router.post('/inspectors', authenticate, authorize(['admin']), createInspector);

export default router; 