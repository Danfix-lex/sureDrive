"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const PORT = process.env.PORT || 5000;
const httpServer = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: '*' }
});
exports.io = io;
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // broadcast to all
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
