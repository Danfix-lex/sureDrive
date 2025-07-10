import { Router } from 'express';
import { register, login, inspectorLogin, driverLogin, driverRegister } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/inspector-login', inspectorLogin);
router.post('/driver-login', driverLogin);
router.post('/driver-register', driverRegister);

export default router; 