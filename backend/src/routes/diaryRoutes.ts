import { Router } from 'express';
import { auth } from '../middleware/authMiddleware';
import { createDiaryEntry, getDiaryEntries } from '../controllers/diaryController';

const router = Router();

router.use(auth);

router.get('/', getDiaryEntries);
router.post('/', createDiaryEntry);

export default router;
