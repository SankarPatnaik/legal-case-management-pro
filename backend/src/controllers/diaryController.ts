import { Response } from 'express';
import DiaryEntry from '../models/DiaryEntry';
import { AuthRequest } from '../middleware/authMiddleware';

export const createDiaryEntry = async (req: AuthRequest, res: Response) => {
  try {
    const payload = {
      ...req.body,
      owner: req.user?._id
    };
    const created = await DiaryEntry.create(payload);
    const populated = await created.populate('case', 'title status caseType');
    res.status(201).json(populated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getDiaryEntries = async (req: AuthRequest, res: Response) => {
  const { caseId } = req.query as { caseId?: string };
  const filter: Record<string, any> = { owner: req.user?._id };
  if (caseId) {
    filter.case = caseId;
  }
  const entries = await DiaryEntry.find(filter)
    .sort({ date: -1, createdAt: -1 })
    .populate('case', 'title status caseType');
  res.json(entries);
};
