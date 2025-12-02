import mongoose, { Document, Schema } from 'mongoose';
import { RateType } from './LawyerProfile';

export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED';

export interface IBooking extends Document {
  lawyerProfile: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  contactName: string;
  contactEmail: string;
  practiceArea: string;
  message?: string;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  status: BookingStatus;
  meetingUrl?: string;
  rateType: RateType;
  priceQuote?: number;
  currency?: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    lawyerProfile: { type: Schema.Types.ObjectId, ref: 'LawyerProfile', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    practiceArea: { type: String, required: true },
    message: String,
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    timezone: { type: String, required: true },
    status: {
      type: String,
      enum: ['REQUESTED', 'CONFIRMED', 'DECLINED', 'CANCELLED'],
      default: 'REQUESTED'
    },
    meetingUrl: String,
    rateType: { type: String, enum: ['HOURLY', 'FLAT', 'CONTINGENCY'], default: 'HOURLY' },
    priceQuote: Number,
    currency: { type: String, default: 'USD' }
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
