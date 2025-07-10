"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectionService = void 0;
const Inspection_1 = require("../models/Inspection");
const InspectionBooking_1 = require("../models/InspectionBooking");
const Vehicle_1 = require("../models/Vehicle");
class InspectionService {
    async bookInspection(plateNumber, preferredDate) {
        const booking = new InspectionBooking_1.InspectionBooking({ plateNumber, preferredDate, status: 'pending' });
        await booking.save();
        return booking;
    }
    async getInspectionStatus(plateNumber) {
        const vehicle = await Vehicle_1.Vehicle.findOne({ plateNumber });
        if (!vehicle)
            throw new Error('Vehicle not found');
        const inspection = await Inspection_1.Inspection.findOne({ vehicleId: plateNumber }).sort({ timestamp: -1 });
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
exports.InspectionService = InspectionService;
