import mongoose, { Document, Schema } from 'mongoose';

export interface ISupportChat extends Document {
  plateNumber: string;
  message: string;
  sender: 'driver' | 'support';
  createdAt: Date;
}

const SupportChatSchema = new Schema<ISupportChat>({
  plateNumber: { type: String, required: true },
  message: { type: String, required: true },
  sender: { type: String, enum: ['driver', 'support'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const SupportChat = mongoose.model<ISupportChat>('SupportChat', SupportChatSchema); 