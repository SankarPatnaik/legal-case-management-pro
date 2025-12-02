import mongoose, { Document, Schema } from 'mongoose';

export type IntakeStatus = 'NEW' | 'IN_REVIEW' | 'APPROVED' | 'DECLINED';

export interface IIntakeForm extends Document {
  contactName: string;
  contactEmail: string;
  practiceArea: string;
  caseType?: string;
  description?: string;
  budget?: number;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
  jurisdiction?: string;
  preferredContactMethod?: 'EMAIL' | 'PHONE' | 'VIDEO';
  status: IntakeStatus;
  documents?: string[];
}

const IntakeFormSchema = new Schema<IIntakeForm>(
  {
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    practiceArea: { type: String, required: true },
    caseType: String,
    description: String,
    budget: Number,
    urgency: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    jurisdiction: String,
    preferredContactMethod: { type: String, enum: ['EMAIL', 'PHONE', 'VIDEO'], default: 'EMAIL' },
    status: { type: String, enum: ['NEW', 'IN_REVIEW', 'APPROVED', 'DECLINED'], default: 'NEW' },
    documents: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model<IIntakeForm>('IntakeForm', IntakeFormSchema);
