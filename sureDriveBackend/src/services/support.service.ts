import { SupportIssue } from '../models/SupportIssue';
import { SupportChat } from '../models/SupportChat';

export class SupportService {
  async reportIssue(plateNumber: string, message: string) {
    const issue = new SupportIssue({ plateNumber, message, status: 'open' });
    await issue.save();
    return issue;
  }

  async chatSupport(plateNumber: string, message: string, sender: 'driver' | 'support') {
    const chat = new SupportChat({ plateNumber, message, sender });
    await chat.save();
    return chat;
  }
} 