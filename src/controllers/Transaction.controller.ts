import { Request, Response, NextFunction } from "express";
import {
  buyAirtime,
  buyData,
  validateMeterNumber,
  generateElectricityToken,
  validateBettingAccount,
  fundBettingAccount,
} from "../service/transactionService";

export class TransactionController {
  // Buy Airtime
  public buyAirtime = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { network, phone, amount, ref } = req.body;
      if (!network || !phone || !amount || !ref) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const result = await buyAirtime(network, phone, amount, ref);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Buy Data
  public buyData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { service, MobileNumber, DataPlan, ref } = req.body;
      console.log("Received request:", { service, MobileNumber, DataPlan, ref });
      if (!service || !MobileNumber || !DataPlan || !ref) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const result = await buyData(service, MobileNumber, DataPlan, ref);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Validate Electricity Meter Number
  public validateMeter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { service, smartNo, type } = req.body;
      if (!service || !smartNo || !type) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const result = await validateMeterNumber(service, smartNo, type);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Generate Electricity Token
  public generateElectricityToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { service, accountno, vcode, amount, ref } = req.body;
      if (!service || !accountno || !vcode || !amount || !ref) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const result = await generateElectricityToken(service, accountno, vcode, amount, ref);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Validate Betting Account
  public validateBettingAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { customerId, service } = req.body;
      if (!customerId || !service) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const result = await validateBettingAccount(customerId, service);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Top-up Betting Account
  public topUpBettingAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { service, customerId, reference, amount, customerName, request_id } = req.body;
      if (!service || !customerId || !reference || !amount || !customerName || !request_id) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const result = await fundBettingAccount(service, customerId, reference, amount, customerName, request_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
