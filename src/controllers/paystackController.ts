import { NextFunction, Request, Response } from "express";
import { PaymentServiceImpl } from "../service/implementation/paymentImplementation";

export class PaymentController {
  private paymentService: PaymentServiceImpl;

  constructor() {
    this.paymentService = new PaymentServiceImpl();
  }

  // ✅ Initiate Payment
  public initiatePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, amount, userId } = req.body;
      const metadata = { userId };

      const paymentData = await this.paymentService.initializePayment(email, amount, metadata);

      res.status(200).json({ status: "success", data: paymentData });
    } catch (error) {
      next();
    }
  };

  // ✅ Verify Payment
  public verifyPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { reference } = req.params;

      const isVerified = await this.paymentService.verifyPayment(reference);

      if (isVerified) {
        res.status(200).json({ status: "success", message: "Payment verified successfully" });
      } else {
        res.status(400).json({ status: "failed", message: "Payment verification failed" });
      }
    } catch (error) {
      next();
    }
  };
}
