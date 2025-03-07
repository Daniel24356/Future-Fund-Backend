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



    async joinContribution(data: JoinContributionDTO): Promise<ContributionMember> {
        const isMemberExists = await db.contributionMember.findFirst({
            where: {
              userId: data.userId,
            }
        })
        if(isMemberExists){
            throw new CustomError(StatusCodes.BAD_REQUEST, "User is already a member of this contribution room")
        }

        const newMember = await db.contributionMember.create({
              data: {
                userId: data.userId,
                contributionId: data.contributionId
              }
        })
        return newMember
    }
    
    payContribution(data: PayContributionDTO): Promise<ContributionMember> {
        throw new Error("Method not implemented.");
    }
    getUserContributions(userId: string): Promise<ContributionMember[]> {
        throw new Error("Method not implemented.");
    }
    
}