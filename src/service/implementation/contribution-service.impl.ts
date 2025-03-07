import { Contribution, ContributionMember } from "@prisma/client";
import { CreateContributionDTO } from "../../dto/createContribution.dto";
import { JoinContributionDTO } from "../../dto/joinContribution.dto";
import { PayContributionDTO } from "../../dto/payContribution.dto";
import { ContributionService } from "../contribution.service";
import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";
import { StatusCodes } from "http-status-codes";


export class ContributionServiceImpl implements ContributionService{
   async createContribution(data: CreateContributionDTO): Promise<Contribution> {
       const isContributionExists = await db.contribution.findFirst({
        where: {
            name: data.name,
        }
       })
       if(isContributionExists){
         throw new CustomError(StatusCodes.BAD_REQUEST, "Contribution Room already exists")
       }
       const contributionRoom = await db.contribution.create({
         data: {
              createdById: data.createdById,
              name: data.name,
              amountPerUser: data.amountPerUser,
              cycle: data.cycle,
         }
       })
       return contributionRoom
    }
    
    joinContribution(data: JoinContributionDTO): Promise<ContributionMember> {
        throw new Error("Method not implemented.");
    }
    payContribution(data: PayContributionDTO): Promise<ContributionMember> {
        throw new Error("Method not implemented.");
    }
    getUserContributions(userId: string): Promise<ContributionMember[]> {
        throw new Error("Method not implemented.");
    }
    
}