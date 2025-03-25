import { Request, Response, NextFunction } from "express";
import twilio from "twilio";
import { db } from "../configs/db";

export class OtpController {
  private client: twilio.Twilio;
  private twilioPhoneNumber: string;

  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;
  }

  public sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        res.status(400).json({ success: false, message: "Phone number is required" });
        return;
      }
  
      // Check if user exists
      const user = await db.user.findUnique({
        where: { phoneNumber },
      });
  
      if (!user) {
        res.status(400).json({ success: false, message: "User not found. Please register first." });
        return;
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await db.user.update({
        where: { phoneNumber },
        data: { otp, otpExpiresAt },
      });
       
      await this.client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: this.twilioPhoneNumber,
        to: phoneNumber,
      });

      res.status(200).json({ success: true, otp, message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  };

  public verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { phoneNumber, otp } = req.body;
      if (!phoneNumber || !otp) {
        res.status(400).json({ success: false, message: "Phone number and OTP are required" });
        return;
      }
   
      // Find user by phone number
      const user = await db.user.findUnique({ where: { phoneNumber } });

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
      await db.user.update({
        where: { phoneNumber },
        data: { emailVerified: true, otp: null, otpExpiresAt: null }, // Clear OTP after verification
      });

      res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      next(error);
    }
  };


}
