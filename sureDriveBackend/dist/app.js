"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const vehicle_routes_1 = __importDefault(require("./routes/vehicle.routes"));
const inspection_routes_1 = __importDefault(require("./routes/inspection.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const driver_routes_1 = __importDefault(require("./routes/driver.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sureDrive';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/vehicles', vehicle_routes_1.default);
app.use('/api/inspections', inspection_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/driver', driver_routes_1.default);
// Error handler
app.use(errorHandler_1.errorHandler);
// MongoDB connection
mongoose_1.default.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
exports.default = app;
