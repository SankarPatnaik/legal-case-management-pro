import { Router } from 'express';
import { auth, requireRole } from '../middleware/authMiddleware';
import {
  createInvoice,
  createTimeEntry,
  getInvoices,
  getTimeEntries,
  updateInvoiceStatus,
  recordExpense,
  getExpenses,
  getAuditTrail
} from '../controllers/billingController';

const router = Router();

router.use(auth);

router.post('/time-entries', createTimeEntry);
router.get('/time-entries', getTimeEntries);

router.post('/invoices', requireRole(['ADMIN', 'ATTORNEY']), createInvoice);
router.get('/invoices', getInvoices);
router.patch('/invoices/:id/status', requireRole(['ADMIN', 'ATTORNEY']), updateInvoiceStatus);

router.post('/expenses', recordExpense);
router.get('/expenses', getExpenses);

router.get('/audit', requireRole(['ADMIN']), getAuditTrail);

export default router;
