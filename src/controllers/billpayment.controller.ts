import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";


export class BillPaymentController{
    private billService: BillPaymentServiceImpl;

     constructor(){
        this.billService = new BillPaymentServiceImpl();
     }

     public payBill = async(
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

       public getUserBillPayments = async(
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