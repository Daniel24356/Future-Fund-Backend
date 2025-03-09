import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { LoanServiceImpl } from "../service/implementation/loan-service.impl";
import { ApplyLoanDTO } from "../dto/applyLoan.dto";
import { RepayLoanDTO } from "../dto/repayLoan.dto";
import { validate } from "class-validator";
import { CustomRequest } from "../Middleware/auth.middleware"; // Adjust path if needed




export class LoanController{
    private loanService: LoanServiceImpl;

     constructor(){
        this.loanService = new LoanServiceImpl();
     }

     
     public applyForLoan = async (
      req: Request, 
      res: Response, 
      next: NextFunction
    ): Promise<void> => {
      try {
        const customReq = req as CustomRequest;
        const userId: string | undefined = customReq.userAuth; 
    
        if (!userId) {
          res.status(401).json({ message: "Unauthorized: User ID is missing" });
          return; 
        }
    
        const data: ApplyLoanDTO = req.body;
        await this.loanService.applyForLoan(data, userId);
    
        res.status(201).json({ message: "Loan application submitted successfully" }); 
        return; 
      } catch (error) {
        next(error); 
      }
    };
    
  

       public updateLoanStatus = async(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try{
         
       }catch(error){
          next(error)
        }
      }

      public repayLoan = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const userId: string | undefined = (req as CustomRequest).userAuth;
  
          if (!userId) {
              res.status(401).json({ message: "Unauthorized: User ID is missing" });
              return;
          }
  
          const repaymentResult = await this.loanService.repayLoan(req.body, userId);
  
          res.status(200).json({
              message: "Loan repayment successful",
              data: repaymentResult,
          });
      } catch (error) {
          const errMsg = error instanceof Error ? error.message : "An error occurred during loan repayment";
          res.status(400).json({ message: errMsg });
      }
      };
      

      public  getUserLoans = async(
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