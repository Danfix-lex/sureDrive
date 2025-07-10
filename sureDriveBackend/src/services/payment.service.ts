import { Payment } from '../models/Payment';

export class PaymentService {
  async makePayment(plateNumber: string, type: 'renewal' | 'VIS', amount: number) {
    const payment = new Payment({ plateNumber, type, amount, status: 'completed' });
    await payment.save();
    return payment;
  }
} 