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
const infobob_service_1 = __importDefault(require("../service/infobob.service")); // Adjust the import if needed
const db_1 = require("../configs/db");
const customError_error_1 = require("../exceptions/error/customError.error");
class OtpController {
    constructor() {
        // Define the method to handle the send-test-otp route
        this.sendTestOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Create an instance of InfobipService
                const infobipService = new infobob_service_1.default();
                // Call the create2FAApplication method to create the 2FA app
                const applicationId = yield infobipService.create2FAApplication();
                // Store applicationId in the database
                //    await db.otpConfig.upsert({
                //     where: { id: '1' }, // Assuming a single configuration row
                //     update: { applicationId },
                //     create: { applicationId, messageId: "" },
                // });
                // If successful, send a success response
                res.status(200).json({
                    error: false,
                    message: '2FA application created successfully',
                });
            }
            catch (error) {
                // Handle errors by passing them to the error handler middleware
                console.error("Error in sendTestOtp:", error);
                next(error); // Pass the error to the global error handler
            }
        });
        this.createMessageTemplate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { appId, messageText, pinType, pinLength, senderId } = req.body;
                // Validate required fields
                if (!appId || !messageText || !pinType || !pinLength || !senderId) {
                    res.status(400).json({
                        error: true,
                        message: 'All fields (appId, messageText, pinType, pinLength, senderId) are required',
                    });
                }
                const infobipService = new infobob_service_1.default();
                // Call the createMessageTemplate method to create a message template
                const messageId = yield infobipService.createMessageTemplate(appId, {
                    pinType,
                    messageText,
                    pinLength,
                    senderId,
                });
                // Store messageId in the database
                // await db.otpConfig.upsert({
                //     where: { id: '1' }, // Assuming a single configuration row
                //     update: { messageId },
                //     create: { applicationId: appId, messageId },
                // });
                res.status(200).json({
                    error: false,
                    message: 'Message template created successfully',
                });
            }
            catch (error) {
                console.error('Error in createMessageTemplate:', error);
                next(error);
            }
        });
        this.sendOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId, messageId, phoneNumber } = req.body;
                // Create an instance of InfobipService
                const infobipService = new infobob_service_1.default();
                // Call sendPasscode to send OTP
                yield infobipService.sendPasscode(applicationId, messageId, phoneNumber);
                // If successful, send a success response
                res.status(200).json({
                    error: false,
                    message: 'OTP delivered successfully',
                });
            }
            catch (error) {
                // Handle errors by passing them to the error handler middleware
                console.error("Error in sendTestOtp:", error);
                next(error); // Pass the error to the global error handler
            }
        });
        this.verifyOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { pinId, pinCode } = req.body; // The pinId and pinCode from the request body
                if (!pinId || !pinCode) {
                    throw new customError_error_1.CustomError(400, "pinId and pinCode are required");
                }
                const otpRequest = yield db_1.db.otpRequest.findFirst({
                    where: { messageId: pinId, status: "PENDING" },
                    include: { user: true }, // Include user details
                });
                if (!otpRequest) {
                    throw new customError_error_1.CustomError(404, "OTP request not found or already verified");
                }
                // Create an instance of InfobipService
                const infobipService = new infobob_service_1.default();
                // Call verifyPin to verify the OTP
                yield infobipService.verifyPin(pinId, pinCode);
                yield db_1.db.otpRequest.update({
                    where: { id: otpRequest.id },
                    data: { status: "VERIFIED" },
                });
                // Update user record to mark email as verified
                yield db_1.db.user.update({
                    where: { id: otpRequest.userId },
                    data: { emailVerified: true },
                });
                // If successful, send a success response
                res.status(200).json({
                    error: false,
                    message: 'OTP verified successfully',
                });
            }
            catch (error) {
                // Handle errors by passing them to the error handler middleware
                console.error("Error in verifyOtp:", error);
                next(error); // Pass the error to the global error handler
            }
        });
    }
}
exports.default = OtpController;
