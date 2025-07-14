import { Router } from 'express';
import { createInspector } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();


router.post('/inspectors', authenticate, authorize(['admin']), createInspector);

export default router; 