import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { LoanServiceImpl } from "../service/implementation/loan-service.impl";
import { Loan } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export class LoanController{

    private loanService: LoanServiceImpl;

     constructor(){
        this.loanService = new LoanServiceImpl();
     }
       
     public applyForLoan = async(
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

      public updateLoanStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const { loanId } = req.body;
          const { newStatus } = req.body;
    
          if (!loanId || !newStatus) {
            res.status(400).json({ message: "Loan ID and new status are required" });
            return;
          }
    
          if (!["APPROVED", "REJECTED"].includes(newStatus)) {
            res.status(400).json({ message: "Invalid loan status" });
            return;
          }
    
          const updatedLoan = await this.loanService.updateLoanStatus(loanId, newStatus as "APPROVED" | "REJECTED");
    
          if (!updatedLoan) {
            res.status(404).json({ message: "Loan not found" });
            return;
          }
    
          res.status(200).json({ message: "Loan status updated successfully", loan: updatedLoan });
        } catch (error) {
          console.error("Error updating loan status:", error);
          next(error);
        }
      };

}
}

