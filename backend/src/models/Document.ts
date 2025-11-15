import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  case: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  storageUrl: string;
  uploadedBy?: mongoose.Types.ObjectId;
  tags?: string[];
  isRedacted: boolean;
}

const DocumentSchema = new Schema<IDocument>(
  {
    case: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    fileName: String,
    fileType: String,
    storageUrl: String,
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    isRedacted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);
