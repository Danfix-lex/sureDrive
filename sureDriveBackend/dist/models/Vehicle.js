"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = exports.VehicleStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["ACTIVE"] = "active";
    VehicleStatus["INACTIVE"] = "inactive";
    VehicleStatus["SUSPENDED"] = "suspended";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));
const VehicleSchema = new mongoose_1.Schema({
    vehicleId: { type: String, required: true, unique: true },
    plateNumber: { type: String, required: true, unique: true },
    vehicleModel: { type: String, required: true }, // renamed from model
    make: { type: String, required: true },
    ownerId: { type: String, required: true, ref: 'User' },
    status: { type: String, enum: Object.values(VehicleStatus), default: VehicleStatus.ACTIVE },
    lastInspection: { type: Date },
}, { timestamps: true });
exports.Vehicle = mongoose_1.default.model('Vehicle', VehicleSchema);
