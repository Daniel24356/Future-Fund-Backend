import { Router } from "express";
import { OtpController } from "../controllers/twilio.controller";

const twiliorouter = Router();
const otpController = new OtpController();

twiliorouter.post("/", otpController.sendOtp);
twiliorouter.post("/verify", otpController.verifyOtp);
export default twiliorouter;
