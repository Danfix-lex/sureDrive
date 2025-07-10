import { Router } from 'express';
import { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, searchVehicleByPlate, getVehicleByQR, updateVehicleStatus, verifyVehicle } from '../controllers/vehicle.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getVehicles);
router.get('/:id', authenticate, getVehicleById);
router.post('/', authenticate, createVehicle);
router.put('/:id', authenticate, updateVehicle);
router.delete('/:id', authenticate, deleteVehicle);
router.get('/search/plate', authenticate, searchVehicleByPlate);
router.get('/qr/:plateNumber', authenticate, getVehicleByQR);
router.put('/:id/status', authenticate, updateVehicleStatus);
router.put('/:id/verify', authenticate, verifyVehicle);

export default router; 