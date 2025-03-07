import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { LoanServiceImpl } from "../service/implementation/loan-service.impl";


export class LoanController{
    updateLoanStatus(arg0: string, updateLoanStatus: any) {
        throw new Error("Method not implemented.");
    }
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

       async updateStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { loanId, newStatus } = req.body;

            if (!loanId || !newStatus) {
                return res.status(400).json({ message: "Loan ID and status are required" });
            }

            const updatedLoan = await this.loanService.updateLoanStatus(loanId, newStatus);

            return res.status(200).json({ message: "Loan status updated", data: updatedLoan });
        } catch (error) {
            console.error("Error updating loan status:", (error as Error).message);
            return res.status(500).json({ message: "Internal Server Error" });
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

}