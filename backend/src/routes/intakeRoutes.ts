import { Router } from 'express';
import { auth } from '../middleware/authMiddleware';
import { createIntakeForm, listIntakeForms, updateIntakeStatus } from '../controllers/intakeController';

const router = Router();

router.post('/', createIntakeForm);
router.use(auth);
router.get('/', listIntakeForms);
router.patch('/:id', updateIntakeStatus);

export default router;
