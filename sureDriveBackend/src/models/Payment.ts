import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  plateNumber: string;
  type: 'renewal' | 'VIS';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  plateNumber: { type: String, required: true },
  type: { type: String, enum: ['renewal', 'VIS'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema); 