"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const twilio_controller_1 = require("../controllers/twilio.controller");
const twiliorouter = (0, express_1.Router)();
const otpController = new twilio_controller_1.OtpController();
twiliorouter.post("/", otpController.sendOtp);
twiliorouter.post("/verify", otpController.verifyOtp);
exports.default = twiliorouter;
