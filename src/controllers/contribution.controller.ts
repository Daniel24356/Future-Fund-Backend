import { NextFunction, Request, Response } from "express";
import { BillPaymentServiceImpl } from "../service/implementation/billpayment-service.impl";
import { ContributionServiceImpl } from "../service/implementation/contribution-service.impl";
import { PayContributionDTO } from "../dto/payContribution.dto";
import { CreateContributionDTO } from "../dto/createContribution.dto";
import { JoinContributionDTO } from "../dto/joinContribution.dto";
import { CustomRequest } from "../Middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";


export class ContributionController{
    private contributionService: ContributionServiceImpl;

     constructor(){
        this.contributionService = new ContributionServiceImpl();
     }

     public  createContribution = async(
         req: CustomRequest,
         res: Response,
         next: NextFunction
       ): Promise<void> => {
         try{
          const userId = req.userAuth || ""
          const contributionData = req.body as CreateContributionDTO
          const newContribution = await this.contributionService.createContribution(userId, contributionData)
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
         const payData = req.body as PayContributionDTO
         const payment = this.contributionService.payContribution(payData)
         res.status(200).json(payment)
       }catch(error){
          next(error)
        }
      }

      public  getUserContributions = async(
        req: CustomRequest,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try{
         const userId = req.userAuth || ""
         const contributions = await this.contributionService.getUserContributions(userId)
         res.status(200).json(contributions)
       }catch(error){
          next(error)
        }
      }

      public getAllContributionMembers = async (
        req: CustomRequest,
        res: Response,
        next: NextFunction
      ): Promise <void> => {
        try{
          const contributionId = req.params.contributionId
          const members = await this.contributionService.getAllContributionMembers(contributionId)
          res.status(200).json(members)
        }catch(error){
          next(error)
        }
      }


      public inviteUsersToContribution = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId, userEmails } = req.body;
          await this.contributionService.inviteUsersToContribution(contributionId, userEmails);
          res.status(StatusCodes.OK).json({ message: "Users invited successfully" });
        } catch (error) {
          next(error);
        }
      };
      
      public verifyIdentityAndJoin = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { userId, contributionId, verificationData } = req.body;
          const member = await this.contributionService.verifyIdentityAndJoin(userId, contributionId, verificationData);
          res.status(StatusCodes.OK).json(member);
        } catch (error) {
          next(error);
        }
      };
      
      public agreeToPaymentTerms = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { userId, contributionId } = req.body;
          await this.contributionService.agreeToPaymentTerms(userId, contributionId);
          res.status(StatusCodes.OK).json({ message: "User agreed to payment terms" });
        } catch (error) {
          next(error);
        }
      };

      public assignContributionTurns = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId } = req.params;
          await this.contributionService.assignContributionTurns(contributionId);
          res.status(200).json({ message: "Contribution turns assigned successfully" });
        } catch (error) {
          next(error);
        }
      };
      
      public startContributionCycle = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId } = req.body;
          await this.contributionService.startContributionCycle(contributionId);
          res.status(StatusCodes.OK).json({ message: "Contribution cycle started" });
        } catch (error) {
          next(error);
        }
      };
      
      public holdFundsInEscrow = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId, amount } = req.body;
          await this.contributionService.holdFundsInEscrow(contributionId, amount);
          res.status(StatusCodes.OK).json({ message: "Funds held in escrow" });
        } catch (error) {
          next(error);
        }
      };
      
      public enforceTrustBuildingPeriod = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId } = req.body;
          await this.contributionService.enforceTrustBuildingPeriod(contributionId);
          res.status(StatusCodes.OK).json({ message: "Trust-building period enforced" });
        } catch (error) {
          next(error);
        }
      };
      
      public processPayouts = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId } = req.body;
          await this.contributionService.processPayouts(contributionId);
          res.status(StatusCodes.OK).json({ message: "Payout processed successfully" });
        } catch (error) {
          next(error);
        }
      };
      
      public penalizeLatePayers = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId } = req.body;
          await this.contributionService.penalizeLatePayers(contributionId);
          res.status(StatusCodes.OK).json({ message: "Late payers penalized" });
        } catch (error) {
          next(error);
        }
      };
      
      public reassignForfeitedSpots = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId } = req.body;
          await this.contributionService.reassignForfeitedSpots(contributionId);
          res.status(StatusCodes.OK).json({ message: "Forfeited spots reassigned" });
        } catch (error) {
          next(error);
        }
      };
      
      public finalizeContributionCycle = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { contributionId } = req.body;
          await this.contributionService.finalizeContributionCycle(contributionId);
          res.status(StatusCodes.OK).json({ message: "Contribution cycle finalized" });
        } catch (error) {
          next(error);
        }
      };
      
}