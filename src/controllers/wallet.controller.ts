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

     public getUserBalance = async(
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

      public withdrawFunds = async(
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

      public getUserTransactions = async(
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

}