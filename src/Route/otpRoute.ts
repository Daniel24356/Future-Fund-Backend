import { Router } from "express";
import OtpController from "../controllers/otp.controller"; // Adjust path if needed

const otpRouter = Router();
const otpController = new OtpController();

otpRouter.post("/send-test-otp", otpController.sendTestOtp);
otpRouter.post('/create-message-template', otpController.createMessageTemplate);
otpRouter.post('/send-otp', otpController.sendOtp)
otpRouter.post('/verify-otp', otpController.verifyOtp)

export default otpRouter;
