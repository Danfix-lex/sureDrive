import { Request, Response } from 'express';
import { Inspection } from '../models/Inspection';
import { Vehicle } from '../models/Vehicle';
import { InspectionBooking } from '../models/InspectionBooking';
import { Payment } from '../models/Payment';
import { SupportIssue } from '../models/SupportIssue';
import { SupportChat } from '../models/SupportChat';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import { io } from '../server';
import { InspectionService } from '../services/inspection.service';
import { PaymentService } from '../services/payment.service';
import { SupportService } from '../services/support.service';

const inspectionService = new InspectionService();
const paymentService = new PaymentService();
const supportService = new SupportService();

export const viewInspectionStatus = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.query;
    if (!plateNumber) return res.status(400).json({ error: 'plateNumber required' });
    const status = await inspectionService.getInspectionStatus(plateNumber as string);
    res.json(status);
  } catch (err) {
    if (err instanceof Error && err.message === 'Vehicle not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Server error', details: err });
    }
  }
};

export const bookInspection = async (req: Request, res: Response) => {
  try {
    const { plateNumber, preferredDate } = req.body;
    if (!plateNumber || !preferredDate) {
      return res.status(400).json({ error: 'plateNumber and preferredDate required' });
    }
    const booking = await inspectionService.bookInspection(plateNumber, preferredDate);
    res.status(201).json({ message: 'Inspection booking created', booking });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const downloadCertificate = async (req: Request, res: Response) => {
  try {
    const { plateNumber } = req.query;
    if (!plateNumber) return res.status(400).json({ error: 'plateNumber required' });
    const inspection = await Inspection.findOne({ vehicleId: plateNumber, result: 'pass' }).sort({ timestamp: -1 });
    if (!inspection) return res.status(404).json({ error: 'No passed inspection found' });
    const vehicle = await Vehicle.findOne({ plateNumber });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=inspection-certificate-${plateNumber}.pdf`);
    doc.text('Vehicle Inspection Certificate', { align: 'center', underline: true });
    doc.moveDown();
    doc.text(`Plate Number: ${plateNumber}`);
    doc.text(`Inspection Date: ${inspection.timestamp}`);
    doc.text(`Result: ${inspection.result}`);
    doc.text(`Inspector ID: ${inspection.inspectorId}`);
    doc.text(`Vehicle Model: ${(vehicle as any).vehicleModel}`);
    doc.text(`Vehicle Make: ${(vehicle as any).make}`);
    doc.text(`Status: ${(vehicle as any).status}`);
    doc.end();
    doc.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const makePayment = async (req: Request, res: Response) => {
  try {
    const { plateNumber, type, amount } = req.body;
    if (!plateNumber || !type || !amount) {
      return res.status(400).json({ error: 'plateNumber, type, and amount required' });
    }
    const payment = await paymentService.makePayment(plateNumber, type, amount);
    res.status(201).json({ message: 'Payment recorded', payment });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const getTraffic = async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ error: 'origin and destination required' });
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin as string)}&destination=${encodeURIComponent(destination as string)}&key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;
    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ error: 'No route found' });
    }
    const summary = data.routes[0].summary;
    const legs = data.routes[0].legs[0];
    const duration = legs.duration.text;
    const distance = legs.distance.text;
    res.json({ summary, duration, distance, raw: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const reportIssue = async (req: Request, res: Response) => {
  try {
    const { plateNumber, message } = req.body;
    if (!plateNumber || !message) {
      return res.status(400).json({ error: 'plateNumber and message required' });
    }
    const issue = new SupportIssue({ plateNumber, message, status: 'open' });
    await issue.save();
    res.status(201).json({ message: 'Issue reported', issue });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const chatSupport = async (req: Request, res: Response) => {
  try {
    const { plateNumber, message, sender } = req.body;
    if (!plateNumber || !message || !sender) {
      return res.status(400).json({ error: 'plateNumber, message, and sender required' });
    }
    const chat = new SupportChat({ plateNumber, message, sender });
    await chat.save();
    io.emit('chat message', { plateNumber, message, sender, createdAt: chat.createdAt });
    res.status(201).json({ message: 'Message sent to support', chat });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
}; 