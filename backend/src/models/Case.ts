import mongoose, { Document, Schema } from 'mongoose';

export type CaseType = 'LITIGATION' | 'INVESTIGATION' | 'REGULATORY' | 'DISPUTE';
export type CaseStatus = 'INTAKE' | 'INVESTIGATION' | 'ACTIVE' | 'CLOSED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface IParty {
  name: string;
  role: 'PLAINTIFF' | 'DEFENDANT' | 'CLIENT' | 'OTHER';
}

export interface ICase extends Document {
  title: string;
  description?: string;
  caseType: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  region?: string;
  jurisdiction?: string;
  assignedTo?: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  parties?: IParty[];
  slaDeadline?: Date;
  isLegalHold: boolean;
}

const PartySchema = new Schema<IParty>(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ['PLAINTIFF', 'DEFENDANT', 'CLIENT', 'OTHER'], required: true }
  },
  { _id: false }
);

const CaseSchema = new Schema<ICase>(
  {
    title: { type: String, required: true },
    description: String,
    caseType: {
      type: String,
      enum: ['LITIGATION', 'INVESTIGATION', 'REGULATORY', 'DISPUTE'],
      required: true
    },
    status: {
      type: String,
      enum: ['INTAKE', 'INVESTIGATION', 'ACTIVE', 'CLOSED'],
      default: 'INTAKE'
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    region: String,
    jurisdiction: String,
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    parties: [PartySchema],
    slaDeadline: Date,
    isLegalHold: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<ICase>('Case', CaseSchema);
