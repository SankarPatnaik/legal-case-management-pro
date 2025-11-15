import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { auth, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Registration endpoint kept for ADMIN; lock down in production
router.post('/register', auth, requireRole(['ADMIN']), register);
router.post('/login', login);

export default router;
