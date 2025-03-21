"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_controller_1 = __importDefault(require("../controllers/otp.controller")); // Adjust path if needed
const otpRouter = (0, express_1.Router)();
const otpController = new otp_controller_1.default();
otpRouter.post("/send-test-otp", otpController.sendTestOtp);
otpRouter.post('/create-message-template', otpController.createMessageTemplate);
otpRouter.post('/send-otp', otpController.sendOtp);
otpRouter.post('/verify-otp', otpController.verifyOtp);
exports.default = otpRouter;
