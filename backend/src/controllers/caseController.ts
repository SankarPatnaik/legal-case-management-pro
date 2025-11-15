import { Response } from 'express';
import Case from '../models/Case';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCase = async (req: AuthRequest, res: Response) => {
  try {
    const payload = {
      ...req.body,
      assignedTo: req.user?._id
    };
    const created = await Case.create(payload);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getCases = async (req: AuthRequest, res: Response) => {
  const cases = await Case.find().populate('assignedTo', 'name email role');
  res.json(cases);
};

export const getMyCases = async (req: AuthRequest, res: Response) => {
  const cases = await Case.find({ assignedTo: req.user?._id }).populate(
    'assignedTo',
    'name email role'
  );
  res.json(cases);
};

export const getCaseById = async (req: AuthRequest, res: Response) => {
  const c = await Case.findById(req.params.id).populate('assignedTo', 'name email role');
  if (!c) {
    return res.status(404).json({ message: 'Case not found' });
  }
  res.json(c);
};

export const updateCaseStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body as { status: string };
  const c = await Case.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(c);
};
