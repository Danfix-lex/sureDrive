"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverRegister = exports.driverLogin = exports.inspectorLogin = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
const register = async (req, res) => {
    res.status(201).json({ message: 'User registered (placeholder)' });
};
exports.register = register;
const login = async (req, res) => {
    res.status(200).json({ message: 'User logged in (placeholder)' });
};
exports.login = login;
const inspectorLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const result = await authService.inspectorLogin(username, password);
        res.json({
            message: 'Inspector login successful',
            token: result.token,
            inspector: result.inspector,
        });
    }
    catch (err) {
        res.status(401).json({ error: err instanceof Error ? err.message : 'Invalid credentials' });
    }
};
exports.inspectorLogin = inspectorLogin;
const driverLogin = async (req, res) => {
    try {
        const { name, driverLicense, plateNumber } = req.body;
        if (!name || !driverLicense || !plateNumber) {
            return res.status(400).json({ error: 'Name, driver license, and plate number required' });
        }
        const result = await authService.driverLogin(name, driverLicense, plateNumber);
        res.json({
            message: 'Driver login successful',
            token: result.token,
            driver: result.driver,
        });
    }
    catch (err) {
        res.status(401).json({ error: err instanceof Error ? err.message : 'Invalid credentials' });
    }
};
exports.driverLogin = driverLogin;
const driverRegister = async (req, res) => {
    try {
        const { name, driverLicense, plateNumber, phone, language } = req.body;
        if (!name || !driverLicense || !plateNumber || !phone) {
            return res.status(400).json({ error: 'Name, driver license, plate number, and phone required' });
        }
        const driver = await authService.driverRegister({ name, driverLicense, plateNumber, phone, language });
        res.status(201).json({
            message: 'Driver registered, pending verification',
            driver,
        });
    }
    catch (err) {
        res.status(409).json({ error: err instanceof Error ? err.message : 'Registration error' });
    }
};
exports.driverRegister = driverRegister;
