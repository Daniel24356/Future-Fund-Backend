import { Request, Response, NextFunction } from 'express';
import InfobipService from '../service/infobob.service'; // Adjust the import if needed
import { db } from '../configs/db';
import { CustomError } from '../exceptions/error/customError.error';



class OtpController {
  // Define the method to handle the send-test-otp route
  public sendTestOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Create an instance of InfobipService
      const infobipService = new InfobipService();
      
      // Call the create2FAApplication method to create the 2FA app
      const applicationId =   await infobipService.create2FAApplication();

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
    } catch (error) {
      // Handle errors by passing them to the error handler middleware
      console.error("Error in sendTestOtp:", error);
      next(error); // Pass the error to the global error handler
    }
  };

  public createMessageTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { appId, messageText, pinType, pinLength, senderId } = req.body;

      // Validate required fields
      if (!appId || !messageText || !pinType || !pinLength || !senderId) {
          res.status(400).json({
          error: true,
          message: 'All fields (appId, messageText, pinType, pinLength, senderId) are required',
        });
      }

      const infobipService = new InfobipService();

      // Call the createMessageTemplate method to create a message template
      const messageId =  await infobipService.createMessageTemplate(appId, {
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
    } catch (error) {
      console.error('Error in createMessageTemplate:', error);
      next(error);
    }
  };
   
   public sendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { applicationId, messageId, phoneNumber } = req.body;

      // Create an instance of InfobipService
      const infobipService = new InfobipService();

      // Call sendPasscode to send OTP
      await infobipService.sendPasscode(applicationId, messageId, phoneNumber);

      // If successful, send a success response
      res.status(200).json({
        error: false,
        message: 'OTP delivered successfully',
      });
    } catch (error) {
      // Handle errors by passing them to the error handler middleware
      console.error("Error in sendTestOtp:", error);
      next(error); // Pass the error to the global error handler
    }
  };

  public verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { pinId, pinCode } = req.body;  // The pinId and pinCode from the request body

      if (!pinId || !pinCode) {
        throw new CustomError(400, "pinId and pinCode are required");
    }

    const otpRequest = await db.otpRequest.findFirst({
      where: { messageId: pinId, status: "PENDING" },
      include: { user: true }, // Include user details
  });

  if (!otpRequest) {
      throw new CustomError(404, "OTP request not found or already verified");
  }

      // Create an instance of InfobipService
      const infobipService = new InfobipService();

      // Call verifyPin to verify the OTP
      await infobipService.verifyPin(pinId, pinCode);

      await db.otpRequest.update({
        where: { id: otpRequest.id },
        data: { status: "VERIFIED" },
    });

    // Update user record to mark email as verified
    await db.user.update({
        where: { id: otpRequest.userId },
        data: { emailVerified: true },
    });

      // If successful, send a success response
      res.status(200).json({
        error: false,
        message: 'OTP verified successfully',
      });
    } catch (error) {
      // Handle errors by passing them to the error handler middleware
      console.error("Error in verifyOtp:", error);
      next(error); // Pass the error to the global error handler
    }
  };
}

export default OtpController;
