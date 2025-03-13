import {
  Contribution,
  ContributionMember,
  PaymentStatus,
  PrismaClient,
} from "@prisma/client";
import { CreateContributionDTO } from "../../dto/createContribution.dto";
import { JoinContributionDTO } from "../../dto/joinContribution.dto";
import { PayContributionDTO } from "../../dto/payContribution.dto";
import { ContributionService } from "../contribution.service";
import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient()
export class ContributionServiceImpl implements ContributionService {
 async getAllContributionMembers(contributionId: string): Promise<ContributionMember[]> {
    const contribution= await db.contribution.findFirst({
      where: {
        id: contributionId
      },
      include: {
        members: true
      }
    })
    if(!contribution){
      throw new CustomError(StatusCodes.NOT_FOUND, "Contribution room not found")
    }
    return contribution.members
    
  }

  async payContribution(data: PayContributionDTO): Promise<ContributionMember> {
    const { userId, contributionId, amount } = data;

    const user = await db.user.findUnique({ 
      where: { id: userId } 
    });
    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
    }

    const contributionMember = await db.contributionMember.findFirst({
      where: { userId, contributionId },
      include: { contribution: true },
    });
    if (!contributionMember) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        "Contribution record not found for this user"
      );
    }

    if (contributionMember.status === PaymentStatus.PAID) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Contribution is already paid"
      );
    }

    const requiredAmount = contributionMember.contribution.amountPerUser;
    if (amount !== requiredAmount) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Invalid payment amount. Expected ${requiredAmount}`
      );
    }

    if (user.balance < amount) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Insufficient balance to pay contribution"
      );
    }

    console.log(
      `Simulating payment of ${amount} for user ${userId} on contribution ${contributionId}`
    );
    
    const [updatedUser, updatedContributionMember] = await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { balance: user.balance - amount },
      }),
      db.contributionMember.update({
        where: { id: contributionMember.id },
        data: { status: PaymentStatus.PAID },
      }),
    ]);

    return updatedContributionMember;
  }

   async createContribution(data: CreateContributionDTO): Promise<Contribution> {
       const isContributionExists = await db.contribution.findFirst({
        where: {
            name: data.name,
        }
       })
       if(isContributionExists){
         throw new CustomError(StatusCodes.BAD_REQUEST, "Contribution Room already exists")
       }
       const contributionRoom = await prisma.contribution.create({
         data: {
              createdById: data.createdById,
              name: data.name,
              amountPerUser: data.amountPerUser,
              cycle: data.cycle,
              maxMembers: data.maxMembers
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
    
    


  async getUserContributions(userId: string): Promise<ContributionMember[]> {
    const isUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!isUser) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "This user doesn't exist");
    }

    const contributions = await db.contributionMember.findMany({
      where: { userId },
      include: {
        contribution: true,
      },
    });

    return contributions;
  }
}
