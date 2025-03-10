import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { LoanServiceImpl } from "../service/implementation/loan-service.impl";
import { WalletServiceImpl } from "../service/implementation/wallet-service.impl";
import { TransferFundsDTO } from "../dto/wallet.dto";


export class WalletController{
    private walletService: WalletServiceImpl;

     constructor(){
        this.walletService = new WalletServiceImpl();
     }

     public getUserBalance = async (
      req: Request,
      res: Response,
      next: NextFunction
  ): Promise<void> => {
      try {
          const { userId } = req.params;
          const balance = await this.walletService.getUserBalance(userId);
          res.status(200).json({ balance });
      } catch (error) {
          next(error);
      }
  };

       public depositFunds = async(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try{
         console.log("first")
       }catch(error){
          next(error)
        }
      }

      public withdrawFunds = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { userId, amount, description } = req.body;
            const transaction = await this.walletService.withdrawFunds(userId, amount, description);
            res.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    };

      public  transferFunds = async(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try{
          const data = req.body as TransferFundsDTO;
          const transaction = await this.walletService.transferFunds(data);
          res.status(200).json(transaction);
       }catch(error){
          next(error)
        }
      }

      public getUserTransactions = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { userId } = req.params;
            const transactions = await this.walletService.getUserTransactions(userId);
            res.status(200).json(transactions);
        } catch (error) {
            next(error);
        }
    };
}