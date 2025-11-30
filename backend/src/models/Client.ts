import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  name: string;
  organization?: string;
  email?: string;
  phone?: string;
  notes?: string;
  cases: mongoose.Types.ObjectId[];
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    organization: String,
    email: String,
    phone: String,
    notes: String,
    cases: [{ type: Schema.Types.ObjectId, ref: 'Case' }]
  },
  { timestamps: true }
);

export default mongoose.model<IClient>('Client', ClientSchema);
