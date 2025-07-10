import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, verifyUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);
router.put('/:id/verify', authenticate, authorize(['admin', 'inspector']), verifyUser);

export default router; 