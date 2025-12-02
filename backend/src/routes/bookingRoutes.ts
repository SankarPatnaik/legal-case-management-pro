import { Router } from 'express';
import { auth } from '../middleware/authMiddleware';
import { createBooking, listBookings, updateBookingStatus } from '../controllers/bookingController';

const router = Router();

router.post('/', createBooking);
router.use(auth);
router.get('/', listBookings);
router.patch('/:id', updateBookingStatus);

export default router;
