import { Inspection } from '../models/Inspection';
import { InspectionBooking } from '../models/InspectionBooking';
import { Vehicle } from '../models/Vehicle';

export class InspectionService {
  async bookInspection(plateNumber: string, preferredDate: Date) {
    const booking = new InspectionBooking({ plateNumber, preferredDate, status: 'pending' });
    await booking.save();
    return booking;
  }

  async getInspectionStatus(plateNumber: string) {
    const vehicle = await Vehicle.findOne({ plateNumber });
    if (!vehicle) throw new Error('Vehicle not found');
    const inspection = await Inspection.findOne({ vehicleId: plateNumber }).sort({ timestamp: -1 });
    let status = 'not inspected';
    let expired = true;
    let lastInspectionDate = null;
    if (inspection) {
      lastInspectionDate = inspection.timestamp;
      const threeHours = 1000 * 60 * 60 * 3;
      expired = (Date.now() - new Date(lastInspectionDate).getTime()) > threeHours;
      status = expired ? 'expired' : inspection.result;
    }
    return { plateNumber, status, lastInspectionDate, expired };
  }
} 