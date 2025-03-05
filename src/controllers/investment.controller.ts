import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { InvestmentServiceImpl } from "../service/implementation/investment-service.impl";


export class InvestmentController{
    private investmentService: InvestmentServiceImpl;

     constructor(){
        this.investmentService = new InvestmentServiceImpl();
     }

     public invest = async(
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

       public getUserInvestments = async(
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