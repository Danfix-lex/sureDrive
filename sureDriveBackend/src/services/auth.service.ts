import { User, Inspector, Driver, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  async createInspector(data: { name: string; username: string; password: string; phone: string; nationalId: string; language?: string }) {
    const { name, username, password, phone, nationalId, language } = data;
    const existing = await Inspector.findOne({ username });
    if (existing) throw new Error('Username already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const inspector = new Inspector({
      userId,
      name,
      username,
      password: hashedPassword,
      phone,
      nationalId,
      role: UserRole.INSPECTOR,
      language: language || 'en',
      isVerified: true,
    });
    await inspector.save();
    return inspector;
  }

  async inspectorLogin(username: string, password: string) {
    const inspector = await Inspector.findOne({ username });
    if (!inspector) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, (inspector as any).password);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign(
      { userId: (inspector as any).userId, role: (inspector as any).role, username: (inspector as any).username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    return { token, inspector };
  }

  async driverLogin(name: string, driverLicense: string, plateNumber: string) {
    const driver = await Driver.findOne({ userId: plateNumber, name, nationalId: driverLicense, isVerified: true });
    if (!driver) throw new Error('Invalid credentials or not verified');
    const token = jwt.sign(
      { userId: (driver as any).userId, role: (driver as any).role, name: (driver as any).name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    return { token, driver };
  }

  async driverRegister(data: { name: string; driverLicense: string; plateNumber: string; phone: string; password: string; language?: string }) {
    const { name, driverLicense, plateNumber, phone, password, language } = data;
    const existing = await Driver.findOne({ userId: plateNumber });
    if (existing) throw new Error('Driver with this plate number already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = new Driver({
      userId: plateNumber,
      name,
      phone,
      nationalId: driverLicense,
      language: language || 'en',
      isVerified: false,
      password: hashedPassword,
    });
    await driver.save();
    return driver;
  }
} 