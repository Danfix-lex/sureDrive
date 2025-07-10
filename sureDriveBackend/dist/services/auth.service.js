"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
class AuthService {
    async createInspector(data) {
        const { name, username, password, phone, nationalId, language } = data;
        const existing = await User_1.Inspector.findOne({ username });
        if (existing)
            throw new Error('Username already exists');
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const userId = (0, uuid_1.v4)();
        const inspector = new User_1.Inspector({
            userId,
            name,
            username,
            password: hashedPassword,
            phone,
            nationalId,
            role: User_1.UserRole.INSPECTOR,
            language: language || 'en',
            isVerified: true,
        });
        await inspector.save();
        return inspector;
    }
    async inspectorLogin(username, password) {
        const inspector = await User_1.Inspector.findOne({ username });
        if (!inspector)
            throw new Error('Invalid credentials');
        const valid = await bcryptjs_1.default.compare(password, inspector.password);
        if (!valid)
            throw new Error('Invalid credentials');
        const token = jsonwebtoken_1.default.sign({ userId: inspector.userId, role: inspector.role, username: inspector.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return { token, inspector };
    }
    async driverLogin(name, driverLicense, plateNumber) {
        const driver = await User_1.Driver.findOne({ userId: plateNumber, name, nationalId: driverLicense, isVerified: true });
        if (!driver)
            throw new Error('Invalid credentials or not verified');
        const token = jsonwebtoken_1.default.sign({ userId: driver.userId, role: driver.role, name: driver.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return { token, driver };
    }
    async driverRegister(data) {
        const { name, driverLicense, plateNumber, phone, language } = data;
        const existing = await User_1.Driver.findOne({ userId: plateNumber });
        if (existing)
            throw new Error('Driver with this plate number already exists');
        const driver = new User_1.Driver({
            userId: plateNumber,
            name,
            phone,
            nationalId: driverLicense,
            role: User_1.UserRole.DRIVER,
            language: language || 'en',
            isVerified: false,
            password: '',
        });
        await driver.save();
        return driver;
    }
}
exports.AuthService = AuthService;
