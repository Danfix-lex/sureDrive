import mongoose, { Document, Schema } from 'mongoose';

export interface ISupportIssue extends Document {
  plateNumber: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: Date;
}

const SupportIssueSchema = new Schema<ISupportIssue>({
  plateNumber: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

export const SupportIssue = mongoose.model<ISupportIssue>('SupportIssue', SupportIssueSchema); 