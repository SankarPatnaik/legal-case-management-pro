import { Request, Response } from 'express';
import IntakeForm from '../models/IntakeForm';
import { AuthRequest } from '../middleware/authMiddleware';

export const createIntakeForm = async (req: Request, res: Response) => {
  try {
    const created = await IntakeForm.create(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listIntakeForms = async (_req: AuthRequest, res: Response) => {
  const items = await IntakeForm.find().sort({ createdAt: -1 });
  res.json(items);
};

export const updateIntakeStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body as { status: string };
  const updated = await IntakeForm.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!updated) {
    return res.status(404).json({ message: 'Intake form not found' });
  }
  res.json(updated);
};
