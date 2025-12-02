import { Request, Response } from 'express';
import LawyerProfile from '../models/LawyerProfile';
import { AuthRequest } from '../middleware/authMiddleware';

export const upsertLawyerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = { ...req.body, user: userId };
    const profile = await LawyerProfile.findOneAndUpdate({ user: userId }, payload, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });

    res.status(201).json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listLawyers = async (req: Request, res: Response) => {
  const { practiceArea, language, jurisdiction, rateType, search } = req.query as {
    practiceArea?: string;
    language?: string;
    jurisdiction?: string;
    rateType?: string;
    search?: string;
  };

  const filter: Record<string, any> = {};
  if (practiceArea) filter.practiceAreas = { $regex: practiceArea, $options: 'i' };
  if (language) filter.languages = { $regex: language, $options: 'i' };
  if (jurisdiction) filter.jurisdictions = { $regex: jurisdiction, $options: 'i' };
  if (rateType) filter.rateType = rateType;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { headline: { $regex: search, $options: 'i' } },
      { practiceAreas: { $regex: search, $options: 'i' } }
    ];
  }

  const lawyers = await LawyerProfile.find(filter).populate('user', 'name email role');
  res.json(lawyers);
};

export const getLawyerProfile = async (req: Request, res: Response) => {
  const profile = await LawyerProfile.findById(req.params.id).populate('user', 'name email role');
  if (!profile) {
    return res.status(404).json({ message: 'Lawyer profile not found' });
  }
  res.json(profile);
};
