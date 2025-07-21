import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, verifyUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getUsers);
router.get('/profile', authenticate, (req, res) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  res.json({
    success: true,
    message: 'Profile fetched successfully',
    data: user,
  });
});
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize(['admin']), deleteUser);
router.put('/:id/verify', authenticate, authorize(['admin']), verifyUser);

export default router; 