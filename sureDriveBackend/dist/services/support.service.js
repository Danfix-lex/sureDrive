"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const SupportIssue_1 = require("../models/SupportIssue");
const SupportChat_1 = require("../models/SupportChat");
class SupportService {
    async reportIssue(plateNumber, message) {
        const issue = new SupportIssue_1.SupportIssue({ plateNumber, message, status: 'open' });
        await issue.save();
        return issue;
    }
    async chatSupport(plateNumber, message, sender) {
        const chat = new SupportChat_1.SupportChat({ plateNumber, message, sender });
        await chat.save();
        return chat;
    }
}
exports.SupportService = SupportService;
