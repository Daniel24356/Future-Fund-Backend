import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { LoanServiceImpl } from "../service/implementation/loan-service.impl";
import { CustomRequest } from "../Middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";

export class LoanController{
    private loanService: LoanServiceImpl;

     constructor(){
        this.loanService = new LoanServiceImpl();
     }

     public   applyForLoan = async(
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

       public updateLoanStatus = async(
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

      public repayLoan = async(
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
      
      public  getUserLoans = async(
        req: CustomRequest,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try{
         const userId = req.userAuth;
         const results = await this.loanService.getUserLoans(userId!, req.query);
         res.status(StatusCodes.OK).send(results);
       }catch(error){
          next(error)
        }
      }
}