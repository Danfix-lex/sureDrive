import mongoose, { Document, Schema } from 'mongoose';

export interface IInspectionBooking extends Document {
  plateNumber: string;
  preferredDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

const InspectionBookingSchema = new Schema<IInspectionBooking>({
  plateNumber: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const InspectionBooking = mongoose.model<IInspectionBooking>('InspectionBooking', InspectionBookingSchema); 