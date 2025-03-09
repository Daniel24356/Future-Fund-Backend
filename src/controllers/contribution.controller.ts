import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { PayContributionDTO } from "../dto/payContribution.dto";


export class ContributionController{
    private contributionService: ContributionServiceImpl;

     constructor(){
        this.contributionService = new ContributionServiceImpl();
     }

     public  createContribution = async(
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

       public  joinContribution = async(
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

      public  payContribution = async(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try{
         const payData = req.body as PayContributionDTO
         const payment = this.contributionService.payContribution(payData)
         res.status(200).json(payment)
       }catch(error){
          next(error)
        }
      }

      public  getUserContributions = async(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try{
         const userId = req.params.id
         const contributions = await this.contributionService.getUserContributions(userId)
         res.status(200).json(contributions)
       }catch(error){
          next(error)
        }
      }

}