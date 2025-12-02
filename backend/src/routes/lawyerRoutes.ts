import { Router } from 'express';
import { auth } from '../middleware/authMiddleware';
import { getLawyerProfile, listLawyers, upsertLawyerProfile } from '../controllers/lawyerController';

const router = Router();

router.get('/', listLawyers);
router.get('/:id', getLawyerProfile);
router.post('/', auth, upsertLawyerProfile);
router.put('/:id', auth, upsertLawyerProfile);

export default router;
