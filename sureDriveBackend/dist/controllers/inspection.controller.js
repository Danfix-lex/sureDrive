"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInspectionHistory = exports.deleteInspection = exports.updateInspection = exports.createInspection = exports.getInspectionById = exports.getInspections = void 0;
const Inspection_1 = require("../models/Inspection");
const Vehicle_1 = require("../models/Vehicle");
const getInspections = (req, res) => {
    res.json({ message: 'getInspections placeholder' });
};
exports.getInspections = getInspections;
const getInspectionById = (req, res) => {
    res.json({ message: 'getInspectionById placeholder' });
};
exports.getInspectionById = getInspectionById;
const createInspection = async (req, res) => {
    try {
        const { plateNumber, inspectorId, checklist, result, qrCodeUrl } = req.body;
        if (!plateNumber || !inspectorId || !result) {
            return res.status(400).json({ error: 'plateNumber, inspectorId, and result are required' });
        }
        // Find vehicle
        const vehicle = await Vehicle_1.Vehicle.findOne({ plateNumber });
        if (!vehicle)
            return res.status(404).json({ error: 'Vehicle not found' });
        // Create inspection
        const inspection = new Inspection_1.Inspection({
            inspectionId: `${plateNumber}-${Date.now()}`,
            vehicleId: plateNumber,
            inspectorId,
            result,
            checklist: checklist || [],
            qrCodeUrl: qrCodeUrl || '',
            timestamp: new Date(),
        });
        await inspection.save();
        // Update vehicle status and lastInspection
        let status = Vehicle_1.VehicleStatus.ACTIVE;
        if (result === Inspection_1.InspectionResult.FAIL)
            status = Vehicle_1.VehicleStatus.SUSPENDED;
        if (result === Inspection_1.InspectionResult.PASS)
            status = Vehicle_1.VehicleStatus.ACTIVE;
        await Vehicle_1.Vehicle.findByIdAndUpdate(vehicle._id, {
            status,
            lastInspection: new Date(),
        });
        res.status(201).json({ message: 'Inspection created', inspection });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.createInspection = createInspection;
const updateInspection = (req, res) => {
    res.json({ message: 'updateInspection placeholder' });
};
exports.updateInspection = updateInspection;
const deleteInspection = (req, res) => {
    res.json({ message: 'deleteInspection placeholder' });
};
exports.deleteInspection = deleteInspection;
const getInspectionHistory = async (req, res) => {
    try {
        const { plateNumber } = req.query;
        if (!plateNumber)
            return res.status(400).json({ error: 'plateNumber required' });
        const inspections = await Inspection_1.Inspection.find({ vehicleId: plateNumber }).sort({ timestamp: -1 });
        let expired = true;
        let lastInspectionDate = null;
        if (inspections.length > 0) {
            lastInspectionDate = inspections[0].timestamp;
            const threeHours = 1000 * 60 * 60 * 3;
            expired = (Date.now() - new Date(lastInspectionDate).getTime()) > threeHours;
        }
        res.json({
            inspections,
            lastInspectionDate,
            expired,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.getInspectionHistory = getInspectionHistory;
