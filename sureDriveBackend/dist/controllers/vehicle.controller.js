"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyVehicle = exports.updateVehicleStatus = exports.getVehicleByQR = exports.searchVehicleByPlate = exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicleById = exports.getVehicles = void 0;
const vehicle_service_1 = require("../services/vehicle.service");
const vehicleService = new vehicle_service_1.VehicleService();
const getVehicles = (req, res) => {
    res.json({ message: 'getVehicles placeholder' });
};
exports.getVehicles = getVehicles;
const getVehicleById = (req, res) => {
    res.json({ message: 'getVehicleById placeholder' });
};
exports.getVehicleById = getVehicleById;
const createVehicle = (req, res) => {
    res.json({ message: 'createVehicle placeholder' });
};
exports.createVehicle = createVehicle;
const updateVehicle = (req, res) => {
    res.json({ message: 'updateVehicle placeholder' });
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = (req, res) => {
    res.json({ message: 'deleteVehicle placeholder' });
};
exports.deleteVehicle = deleteVehicle;
const searchVehicleByPlate = async (req, res) => {
    try {
        const { plateNumber } = req.query;
        if (!plateNumber)
            return res.status(400).json({ error: 'plateNumber required' });
        const result = await vehicleService.searchByPlate(plateNumber);
        res.json(result);
    }
    catch (err) {
        if (err instanceof Error && err.message === 'Vehicle not found') {
            res.status(404).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Server error', details: err });
        }
    }
};
exports.searchVehicleByPlate = searchVehicleByPlate;
const getVehicleByQR = async (req, res) => {
    try {
        const { plateNumber } = req.params;
        const result = await vehicleService.getByQR(plateNumber);
        res.json(result);
    }
    catch (err) {
        if (err instanceof Error && err.message === 'Vehicle not found') {
            res.status(404).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Server error', details: err });
        }
    }
};
exports.getVehicleByQR = getVehicleByQR;
const updateVehicleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status)
            return res.status(400).json({ error: 'status required' });
        const vehicle = await vehicleService.updateStatus(id, status);
        res.json({ message: 'Vehicle status updated', vehicle });
    }
    catch (err) {
        if (err instanceof Error && err.message === 'Vehicle not found') {
            res.status(404).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Server error', details: err });
        }
    }
};
exports.updateVehicleStatus = updateVehicleStatus;
const verifyVehicle = async (req, res) => {
    // Only admin/inspector should be able to call this (enforced by route middleware)
    const vehicle = await vehicleService.verifyVehicle(req.params.id);
    if (!vehicle)
        return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Vehicle verified', vehicle });
};
exports.verifyVehicle = verifyVehicle;
