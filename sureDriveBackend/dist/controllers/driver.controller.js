"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSupport = exports.reportIssue = exports.getTraffic = exports.makePayment = exports.downloadCertificate = exports.bookInspection = exports.viewInspectionStatus = void 0;
const Inspection_1 = require("../models/Inspection");
const Vehicle_1 = require("../models/Vehicle");
const SupportIssue_1 = require("../models/SupportIssue");
const SupportChat_1 = require("../models/SupportChat");
const pdfkit_1 = __importDefault(require("pdfkit"));
const axios_1 = __importDefault(require("axios"));
const server_1 = require("../server");
const inspection_service_1 = require("../services/inspection.service");
const payment_service_1 = require("../services/payment.service");
const support_service_1 = require("../services/support.service");
const inspectionService = new inspection_service_1.InspectionService();
const paymentService = new payment_service_1.PaymentService();
const supportService = new support_service_1.SupportService();
const viewInspectionStatus = async (req, res) => {
    try {
        const { plateNumber } = req.query;
        if (!plateNumber)
            return res.status(400).json({ error: 'plateNumber required' });
        const status = await inspectionService.getInspectionStatus(plateNumber);
        res.json(status);
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
exports.viewInspectionStatus = viewInspectionStatus;
const bookInspection = async (req, res) => {
    try {
        const { plateNumber, preferredDate } = req.body;
        if (!plateNumber || !preferredDate) {
            return res.status(400).json({ error: 'plateNumber and preferredDate required' });
        }
        const booking = await inspectionService.bookInspection(plateNumber, preferredDate);
        res.status(201).json({ message: 'Inspection booking created', booking });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.bookInspection = bookInspection;
const downloadCertificate = async (req, res) => {
    try {
        const { plateNumber } = req.query;
        if (!plateNumber)
            return res.status(400).json({ error: 'plateNumber required' });
        const inspection = await Inspection_1.Inspection.findOne({ vehicleId: plateNumber, result: 'pass' }).sort({ timestamp: -1 });
        if (!inspection)
            return res.status(404).json({ error: 'No passed inspection found' });
        const vehicle = await Vehicle_1.Vehicle.findOne({ plateNumber });
        if (!vehicle)
            return res.status(404).json({ error: 'Vehicle not found' });
        // Generate PDF
        const doc = new pdfkit_1.default();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=inspection-certificate-${plateNumber}.pdf`);
        doc.text('Vehicle Inspection Certificate', { align: 'center', underline: true });
        doc.moveDown();
        doc.text(`Plate Number: ${plateNumber}`);
        doc.text(`Inspection Date: ${inspection.timestamp}`);
        doc.text(`Result: ${inspection.result}`);
        doc.text(`Inspector ID: ${inspection.inspectorId}`);
        doc.text(`Vehicle Model: ${vehicle.vehicleModel}`);
        doc.text(`Vehicle Make: ${vehicle.make}`);
        doc.text(`Status: ${vehicle.status}`);
        doc.end();
        doc.pipe(res);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.downloadCertificate = downloadCertificate;
const makePayment = async (req, res) => {
    try {
        const { plateNumber, type, amount } = req.body;
        if (!plateNumber || !type || !amount) {
            return res.status(400).json({ error: 'plateNumber, type, and amount required' });
        }
        const payment = await paymentService.makePayment(plateNumber, type, amount);
        res.status(201).json({ message: 'Payment recorded', payment });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.makePayment = makePayment;
const getTraffic = async (req, res) => {
    try {
        const { origin, destination } = req.query;
        if (!origin || !destination) {
            return res.status(400).json({ error: 'origin and destination required' });
        }
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;
        const response = await axios_1.default.get(url);
        const data = response.data;
        if (!data.routes || data.routes.length === 0) {
            return res.status(404).json({ error: 'No route found' });
        }
        const summary = data.routes[0].summary;
        const legs = data.routes[0].legs[0];
        const duration = legs.duration.text;
        const distance = legs.distance.text;
        res.json({ summary, duration, distance, raw: data });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.getTraffic = getTraffic;
const reportIssue = async (req, res) => {
    try {
        const { plateNumber, message } = req.body;
        if (!plateNumber || !message) {
            return res.status(400).json({ error: 'plateNumber and message required' });
        }
        const issue = new SupportIssue_1.SupportIssue({ plateNumber, message, status: 'open' });
        await issue.save();
        res.status(201).json({ message: 'Issue reported', issue });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.reportIssue = reportIssue;
const chatSupport = async (req, res) => {
    try {
        const { plateNumber, message, sender } = req.body;
        if (!plateNumber || !message || !sender) {
            return res.status(400).json({ error: 'plateNumber, message, and sender required' });
        }
        const chat = new SupportChat_1.SupportChat({ plateNumber, message, sender });
        await chat.save();
        server_1.io.emit('chat message', { plateNumber, message, sender, createdAt: chat.createdAt });
        res.status(201).json({ message: 'Message sent to support', chat });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error', details: err });
    }
};
exports.chatSupport = chatSupport;
