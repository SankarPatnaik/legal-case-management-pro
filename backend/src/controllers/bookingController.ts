import { Request, Response } from 'express';
import Booking from '../models/Booking';
import LawyerProfile from '../models/LawyerProfile';
import { AuthRequest } from '../middleware/authMiddleware';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const {
      lawyerProfile,
      contactName,
      contactEmail,
      practiceArea,
      message,
      startsAt,
      endsAt,
      timezone,
      rateType,
      priceQuote,
      currency
    } = req.body;

    const profile = await LawyerProfile.findById(lawyerProfile);
    if (!profile) {
      return res.status(404).json({ message: 'Lawyer profile not found' });
    }

    const booking = await Booking.create({
      lawyerProfile,
      contactName,
      contactEmail,
      practiceArea,
      message,
      startsAt,
      endsAt,
      timezone,
      status: 'REQUESTED',
      createdBy: req.user?._id,
      rateType,
      priceQuote,
      currency
    });

    const populated = await booking.populate('lawyerProfile');
    res.status(201).json(populated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listBookings = async (req: AuthRequest, res: Response) => {
  const profile = await LawyerProfile.findOne({ user: req.user?._id });
  const filter: Record<string, any> = {};

  if (req.user?._id) {
    filter.$or = [{ createdBy: req.user._id }];
    if (profile) {
      filter.$or.push({ lawyerProfile: profile._id });
    }
  }

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate('lawyerProfile', 'fullName practiceAreas rateType rateAmount verificationStatus');
  res.json(bookings);
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  const { status, meetingUrl } = req.body as { status?: string; meetingUrl?: string };
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status, meetingUrl },
    { new: true }
  ).populate('lawyerProfile', 'fullName practiceAreas');

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  res.json(booking);
};
