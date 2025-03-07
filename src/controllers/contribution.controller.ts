import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { CreateContributionDTO } from "../dto/createContribution.dto";
import { JoinContributionDTO } from "../dto/joinContribution.dto";


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
          const contributionData = req.body as CreateContributionDTO
          const newContribution = await this.contributionService.createContribution(contributionData)
          res.status(201).json(newContribution)
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
         const member = req.body as JoinContributionDTO
         const newMember = await this.contributionService.joinContribution(member)
         res.status(201).json(newMember)
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
         console.log("first")
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
         console.log("first")
       }catch(error){
          next(error)
        }
      }

}