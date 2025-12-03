import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import TimeEntry from '../models/TimeEntry';
import Invoice from '../models/Invoice';
import Expense from '../models/Expense';
import AuditLog from '../models/AuditLog';

const recordAudit = async (
  req: AuthRequest,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, any>
) => {
  if (!req.user) return;
  await AuditLog.create({
    actor: req.user._id,
    action,
    entityType,
    entityId,
    metadata
  });
};

export const createTimeEntry = async (req: AuthRequest, res: Response) => {
  try {
    const payload = {
      ...req.body,
      user: req.user?._id
    };
    const entry = await TimeEntry.create(payload);
    await recordAudit(req, 'TIME_ENTRY_CREATED', 'TimeEntry', entry._id.toString(), payload);
    res.status(201).json(entry);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTimeEntries = async (req: AuthRequest, res: Response) => {
  const { caseId } = req.query as { caseId?: string };
  const filter: Record<string, any> = {};
  if (caseId) filter.case = caseId;
  const entries = await TimeEntry.find(filter)
    .populate('case', 'title')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(entries);
};

export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const payload = {
      ...req.body,
      issuedBy: req.user?._id
    };
    const invoice = await Invoice.create(payload);
    await recordAudit(req, 'INVOICE_CREATED', 'Invoice', invoice._id.toString(), {
      status: invoice.status,
      total: invoice.total
    });
    res.status(201).json(invoice);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getInvoices = async (_req: AuthRequest, res: Response) => {
  const invoices = await Invoice.find()
    .populate('client', 'name email')
    .populate('case', 'title')
    .populate('issuedBy', 'name')
    .sort({ createdAt: -1 });
  res.json(invoices);
};

export const updateInvoiceStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body as { status: 'DRAFT' | 'SENT' | 'PAID' | 'VOID' };
  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }
  await recordAudit(req, 'INVOICE_STATUS_UPDATED', 'Invoice', invoice._id.toString(), { status });
  res.json(invoice);
};

export const recordExpense = async (req: AuthRequest, res: Response) => {
  try {
    const payload = {
      ...req.body,
      incurredBy: req.user?._id
    };
    const expense = await Expense.create(payload);
    await recordAudit(req, 'EXPENSE_RECORDED', 'Expense', expense._id.toString(), payload);
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getExpenses = async (_req: AuthRequest, res: Response) => {
  const expenses = await Expense.find()
    .populate('incurredBy', 'name')
    .populate('case', 'title')
    .populate('client', 'name')
    .sort({ createdAt: -1 });
  res.json(expenses);
};

export const getAuditTrail = async (_req: AuthRequest, res: Response) => {
  const logs = await AuditLog.find().populate('actor', 'name email role').sort({ createdAt: -1 });
  res.json(logs);
};
