import mongoose, { Document, Schema } from 'mongoose';

export type DiaryPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IDiaryEntry extends Document {
  title: string;
  note: string;
  date: Date;
  owner: mongoose.Types.ObjectId;
  case?: mongoose.Types.ObjectId;
  priority: DiaryPriority;
}

const DiaryEntrySchema = new Schema<IDiaryEntry>(
  {
    title: { type: String, required: true },
    note: { type: String, required: true },
    date: { type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    case: { type: Schema.Types.ObjectId, ref: 'Case' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' }
  },
  { timestamps: true }
);

export default mongoose.model<IDiaryEntry>('DiaryEntry', DiaryEntrySchema);
