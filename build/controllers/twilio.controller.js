"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpController = void 0;
const twilio_1 = __importDefault(require("twilio"));
const db_1 = require("../configs/db");
class OtpController {
    constructor() {
        this.sendOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber } = req.body;
                if (!phoneNumber) {
                    res.status(400).json({ success: false, message: "Phone number is required" });
                    return;
                }
                // Check if user exists
                const user = yield db_1.db.user.findUnique({
                    where: { phoneNumber },
                });
                if (!user) {
                    res.status(400).json({ success: false, message: "User not found. Please register first." });
                    return;
                }
                const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
                const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
                yield db_1.db.user.update({
                    where: { phoneNumber },
                    data: { otp, otpExpiresAt },
                });
                yield this.client.messages.create({
                    body: `Your OTP is: ${otp}`,
                    from: this.twilioPhoneNumber,
                    to: phoneNumber,
                });
                res.status(200).json({ success: true, otp, message: "OTP sent successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber, otp } = req.body;
                if (!phoneNumber || !otp) {
                    res.status(400).json({ success: false, message: "Phone number and OTP are required" });
                    return;
                }
                // Find user by phone number
                const user = yield db_1.db.user.findUnique({ where: { phoneNumber } });
                if (!user || !user.otp || !user.otpExpiresAt) {
                    res.status(400).json({ success: false, message: "OTP not found or expired" });
                    return;
                }
                // Check if OTP matches
                if (user.otp !== otp) {
                    res.status(400).json({ success: false, message: "Invalid OTP" });
                    return;
                }
                // Check if OTP has expired
                if (new Date() > user.otpExpiresAt) {
                    res.status(400).json({ success: false, message: "OTP expired" });
                    return;
                }
                // OTP is valid - Update user status
                yield db_1.db.user.update({
                    where: { phoneNumber },
                    data: { emailVerified: true, otp: null, otpExpiresAt: null }, // Clear OTP after verification
                });
                res.status(200).json({ success: true, message: "OTP verified successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    }
}
exports.OtpController = OtpController;
