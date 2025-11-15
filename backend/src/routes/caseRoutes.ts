import { Router } from 'express';
import { auth } from '../middleware/authMiddleware';
import {
  createCase,
  getCases,
  getMyCases,
  getCaseById,
  updateCaseStatus
} from '../controllers/caseController';

const router = Router();

router.use(auth);

router.post('/', createCase);
router.get('/', getCases);
router.get('/mine', getMyCases);
router.get('/:id', getCaseById);
router.patch('/:id/status', updateCaseStatus);

export default router;
