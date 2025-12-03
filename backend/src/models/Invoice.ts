import mongoose, { Document, Schema } from 'mongoose';

interface IInvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface IInvoice extends Document {
  client: mongoose.Types.ObjectId;
  case?: mongoose.Types.ObjectId;
  issuedBy: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'VOID';
  dueDate?: Date;
  currency: string;
  gstNumber?: string;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    case: { type: Schema.Types.ObjectId, ref: 'Case' },
    issuedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [InvoiceItemSchema], required: true, default: [] },
    taxRate: { type: Number, default: 0 },
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['DRAFT', 'SENT', 'PAID', 'VOID'], default: 'DRAFT' },
    dueDate: Date,
    currency: { type: String, default: 'INR' },
    gstNumber: String
  },
  { timestamps: true }
);

InvoiceSchema.pre('validate', function (next) {
  const subtotal = this.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  this.subtotal = subtotal;
  this.taxAmount = subtotal * ((this.taxRate || 0) / 100);
  this.total = subtotal + this.taxAmount;
  this.items = this.items.map((item) => ({
    ...item,
    total: item.quantity * item.rate
  }));
  next();
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
