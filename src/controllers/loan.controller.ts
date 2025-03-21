import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { LoanServiceImpl } from "../service/implementation/loan-service.impl";
import { ApplyLoanDTO } from "../dto/applyLoan.dto";
import { RepayLoanDTO } from "../dto/repayLoan.dto";
import { validate } from "class-validator";
import { CustomRequest } from "../Middleware/auth.middleware"; // Adjust path if needed
import { uploadFileToCloudinary } from "../utils/CloudinaryUploader";



export class LoanController{
    private loanService: LoanServiceImpl;

     constructor(){
        this.loanService = new LoanServiceImpl();
     }

     
     public applyForLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
          const customReq = req as CustomRequest;
          const userId: string | undefined = customReq.userAuth;

          if (!userId) {
              res.status(401).json({ message: "Unauthorized: User ID is missing" });
              return;
          }

          if (!customReq.file) {
              res.status(400).json({ error: "File upload is required" });
              return;
          }

          // Trim and fix request body keys
          const sanitizedBody = Object.keys(req.body).reduce((acc, key) => {
              acc[key.trim()] = req.body[key];
              return acc;
          }, {} as Record<string, any>);

          // Extract and validate `amount`
          const rawAmount = sanitizedBody["amount"] || sanitizedBody["amount "]; // Handle space issue
          const amount = rawAmount ? Number(rawAmount) : NaN;

          if (!rawAmount || isNaN(amount) || amount < 1000) {
              res.status(400).json({ error: "Loan amount must be at least 1,000 and a valid number." });
              return;
          }

          // Upload file to Cloudinary
          let uploadedFile;
          try {
              uploadedFile = await uploadFileToCloudinary(customReq.file.buffer, "account_statements");
          } catch (error) {
              res.status(500).json({ error: "File upload failed" });
              return;
          }

          if (!uploadedFile?.secure_url) {
              res.status(500).json({ error: "File upload returned no URL" });
              return;
          }

          // Validate employmentStatus
          const validEmploymentStatuses = ["Employed", "Self-employed", "Business owner", "Student"];
          if (!validEmploymentStatuses.includes(sanitizedBody.employmentStatus)) {
              res.status(400).json({ error: "Invalid employment status." });
              return;
          }

          // Validate maritalStatus
          const validMaritalStatuses = ["Married", "Single", "Divorced", "Student"];
          if (!validMaritalStatuses.includes(sanitizedBody.maritalStatus)) {
              res.status(400).json({ error: "Invalid marital status." });
              return;
          }

          // Create DTO with validated data
          const data = new ApplyLoanDTO();
          data.amount = amount;
          data.homeAddress = sanitizedBody.homeAddress;
          data.employmentStatus = sanitizedBody.employmentStatus;
          data.maritalStatus = sanitizedBody.maritalStatus;
          data.accountStatement = uploadedFile.secure_url;

          // Validate DTO
          const errors = await validate(data);
          if (errors.length > 0) {
              res.status(400).json({ message: "Validation failed", errors });
              return;
          }

          // Send data to loanService
          await this.loanService.applyForLoan(data, userId);

          res.status(201).json({ message: "Loan application submitted successfully" });
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