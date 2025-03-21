import { NextFunction, Request, Response } from "express";
import { LoanServiceImpl } from "../service/implementation/loan-service.impl";
import { ApplyLoanDTO } from "../dto/applyLoan.dto";
import { CustomRequest } from "../Middleware/auth.middleware"; // Adjust path if needed
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
       
 
      public repayLoan = async(
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
  
          const repaymentResult = await this.loanService.repayLoan(userId);
  
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

      public  getUserActiveLoan = async(
        req: CustomRequest,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try{
         const userId = req.userAuth;
         const result = await this.loanService.getUserActiveLoan(userId!);
         res.status(StatusCodes.OK).send(result);
       }catch(error){
          next(error)
        }
      }

}


