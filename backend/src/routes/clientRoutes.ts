import { Router } from 'express';
import { auth } from '../middleware/authMiddleware';
import { attachCaseToClient, createClient, getClients } from '../controllers/clientController';

const router = Router();

router.use(auth);

router.get('/', getClients);
router.post('/', createClient);
router.post('/:id/cases', attachCaseToClient);

export default router;
