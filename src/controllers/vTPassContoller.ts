import { NextFunction, Request, Response } from "express";
import { buyAirtime, buyData, payElectricity, verifyMeter } from "../service/vTPassService";

export class VTPASSController {
  
  /**
   * Airtime Purchase Controller
   */
  public airtimePurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { network, phone, amount } = req.body;
      const formattedPhone = Number(`0${phone.substring(1)}`);
      const result = await buyAirtime(network, formattedPhone, amount);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * Data Purchase Controller
   */
  public dataPurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { network, phone, variation_code, billersCode, amount } = req.body;
      const formattedPhone = Number(`0${phone.substring(1)}`);
      const result = await buyData(network, formattedPhone, billersCode, variation_code,  amount );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public verifyMeter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { disco, meterNumber, type } = req.body;
      const result = await verifyMeter( meterNumber, disco, type);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * Electricity Payment Controller
   */
  public electricityPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { disco, meterNumber, amount, type , phone } = req.body;
      const formattedPhone = Number(`0${phone.substring(1)}`);
      const result = await payElectricity(disco, meterNumber, amount, type, formattedPhone);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  /**
   * Betting Wallet Funding Controller
   */
//   public bettingFunding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const { bettingService, customerID, amount } = req.body;
//       const result = await fundBettingAccount(bettingService, customerID, amount);
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   };
}

