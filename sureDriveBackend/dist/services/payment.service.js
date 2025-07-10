"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const Payment_1 = require("../models/Payment");
class PaymentService {
    async makePayment(plateNumber, type, amount) {
        const payment = new Payment_1.Payment({ plateNumber, type, amount, status: 'completed' });
        await payment.save();
        return payment;
    }
}
exports.PaymentService = PaymentService;
