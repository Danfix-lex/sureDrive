import mongoose, { Document, Schema } from 'mongoose';

export enum InspectionResult {
  PASS = 'pass',
  FAIL = 'fail',
  PENDING = 'pending',
}

export interface IInspection extends Document {
  inspectionId: string;
  vehicleId: string;
  inspectorId: string;
  result: InspectionResult;
  checklist: object[];
  qrCodeUrl: string;
  timestamp: Date;
}

const InspectionSchema = new Schema<IInspection>({
  inspectionId: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true, ref: 'Vehicle' },
  inspectorId: { type: String, required: true, ref: 'User' },
  result: { type: String, enum: Object.values(InspectionResult), default: InspectionResult.PENDING },
  checklist: { type: [Schema.Types.Mixed], default: [] },
  qrCodeUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export const Inspection = mongoose.model<IInspection>('Inspection', InspectionSchema); 