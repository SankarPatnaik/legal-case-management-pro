import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  case?: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  incurredBy: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  category: 'COURT_FEE' | 'TRAVEL' | 'FILING' | 'OTHER';
  billable: boolean;
  status: 'RECORDED' | 'REIMBURSED';
  receiptUrl?: string;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    case: { type: Schema.Types.ObjectId, ref: 'Case' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    incurredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ['COURT_FEE', 'TRAVEL', 'FILING', 'OTHER'],
      default: 'OTHER'
    },
    billable: { type: Boolean, default: true },
    status: { type: String, enum: ['RECORDED', 'REIMBURSED'], default: 'RECORDED' },
    receiptUrl: String
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
