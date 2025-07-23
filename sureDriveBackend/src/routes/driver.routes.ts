import { Router } from 'express';
import {
  viewInspectionStatus,
  bookInspection,
  downloadCertificate,
  makePayment,
  getTraffic,
  reportIssue,
  chatSupport,
  getPayments,
  getSupportIssues
} from '../controllers/driver.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/inspection/status', authenticate, viewInspectionStatus);
router.post('/inspection/book', authenticate, bookInspection);
router.get('/inspection/certificate', authenticate, downloadCertificate);
router.post('/payments', authenticate, makePayment);
router.get('/maps/traffic', authenticate, getTraffic);
router.get('/payments', authenticate, getPayments);
router.get('/support/issues', authenticate, getSupportIssues);
router.post('/support/chat', authenticate, chatSupport);

export default router; 