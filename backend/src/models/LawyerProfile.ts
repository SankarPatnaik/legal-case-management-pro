import mongoose, { Document, Schema } from 'mongoose';

export type RateType = 'HOURLY' | 'FLAT' | 'CONTINGENCY';

export interface IAvailabilitySlot {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
}

export interface ILawyerProfile extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  headline?: string;
  bio?: string;
  practiceAreas: string[];
  jurisdictions: string[];
  languages: string[];
  rateType: RateType;
  rateAmount?: number;
  availability: IAvailabilitySlot[];
  yearsExperience?: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  badges: string[];
  reviewsSummary?: {
    averageRating: number;
    totalReviews: number;
  };
}

const AvailabilitySchema = new Schema<IAvailabilitySlot>(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timezone: { type: String, required: true }
  },
  { _id: false }
);

const LawyerProfileSchema = new Schema<ILawyerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    headline: String,
    bio: String,
    practiceAreas: { type: [String], default: [] },
    jurisdictions: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    rateType: { type: String, enum: ['HOURLY', 'FLAT', 'CONTINGENCY'], default: 'HOURLY' },
    rateAmount: Number,
    availability: { type: [AvailabilitySchema], default: [] },
    yearsExperience: Number,
    verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    badges: { type: [String], default: [] },
    reviewsSummary: {
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model<ILawyerProfile>('LawyerProfile', LawyerProfileSchema);
