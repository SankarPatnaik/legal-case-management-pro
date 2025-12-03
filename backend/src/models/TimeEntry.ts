import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeEntry extends Document {
  case: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  description: string;
  rate: number;
  hours: number;
  billable: boolean;
  billed: boolean;
  startedAt?: Date;
  endedAt?: Date;
  totalAmount: number;
}

const TimeEntrySchema = new Schema<ITimeEntry>(
  {
    case: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    rate: { type: Number, required: true },
    hours: { type: Number, required: true },
    billable: { type: Boolean, default: true },
    billed: { type: Boolean, default: false },
    startedAt: Date,
    endedAt: Date,
    totalAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

TimeEntrySchema.pre('validate', function (next) {
  this.totalAmount = (this.hours || 0) * (this.rate || 0);
  next();
});

export default mongoose.model<ITimeEntry>('TimeEntry', TimeEntrySchema);
