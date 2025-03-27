import {
  Contribution,
  ContributionInvitationStatus,
  ContributionMember,
  PaymentStatus,
  PrismaClient,
  User,
} from "@prisma/client";
import { CreateContributionDTO } from "../../dto/createContribution.dto";
import { JoinContributionDTO } from "../../dto/joinContribution.dto";
import { PayContributionDTO } from "../../dto/payContribution.dto";
import { ContributionService } from "../contribution.service";
import { db } from "../../configs/db";
import { CustomError } from "../../exceptions/error/customError.error";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export class ContributionServiceImpl implements ContributionService {
//  async getAllContributionMembers(contributionId: string): Promise<ContributionMember[]> {
//     const contribution= await db.contribution.findFirst({
//       where: {
//         id: contributionId
//       },
//       include: {
//         members: true
//       }
//     })
//     if(!contribution){
//       throw new CustomError(StatusCodes.NOT_FOUND, "Contribution room not found")
//     }
//     return contribution.members
    
//   }

  async getAllContributionMembers(
    contributionId: string
  ): Promise<ContributionMember[]> {

    if (!contributionId) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid contribution ID");
    }

    const contribution = await db.contribution.findUnique({
      where: {
        id: contributionId,
      },
      include: {
        members: true,
        createdBy: true
      },
    });
   
    if (!contribution) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        "Contribution room not found"
      );
    }
    return contribution.members;
  }

  async payContribution(data: PayContributionDTO): Promise<ContributionMember> {
    const { userId, contributionId, amount } = data;

    const user = await db.user.findUnique({
      where: { id: userId },
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



    // async joinContribution(data: JoinContributionDTO): Promise<ContributionMember> {
    //     const isMemberExists = await db.contributionMember.findFirst({
    //         where: {
    //           userId: data.userId,
    //         }
    //     })
    //     if(isMemberExists){
    //         throw new CustomError(StatusCodes.BAD_REQUEST, "User is already a member of this contribution room")
    //     }

    //     const newMember = await db.contributionMember.create({
    //           data: {
    //             userId: data.userId,
    //             contributionId: data.contributionId
    //           }
    //     })
    //     return newMember
    // }
    


   async createContribution(id: string, data: CreateContributionDTO): Promise<Contribution> {
    console.log("User id: ", id)
    const userExists = await db.user.findUnique({
      where: { id }, // Ensure `createdById` is a valid UUID
    });
    
    if (!userExists) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "User does not exist");
    }
    
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
              createdById: id,
              name: data.name,
              amountPerUser: data.amountPerUser,
              cycle: data.cycle,
              maxMembers: data.maxMembers,
              trustPeriodActive: true, // First 3 months, no payouts
              escrowBalance: 0,
         }
       })
       return contributionRoom
    }

 

  async joinContribution(
    data: JoinContributionDTO
  ): Promise<ContributionMember> {
    const isMemberExists = await db.contributionMember.findFirst({
      where: {
        userId: data.userId,
      },
    });
    if (isMemberExists) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "User is already a member of this contribution room"
      );
    }

    const newMember = await db.contributionMember.create({
      data: {
        userId: data.userId,
        contributionId: data.contributionId,
      },
    });
    return newMember;
  }

  async getUserContributions(userId: string): Promise<Contribution[]> {
    const isUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!isUser) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "This user doesn't exist");
    }

    const createdContributions = await db.contribution.findMany({
      where: { createdById: userId },
    });

    const memberContributions = await db.contribution.findMany({
      where: { members: { some: { userId } } },
    });

    const contributions = new Map<string, Contribution>()

    createdContributions.forEach(contribution => {
      contributions.set(contribution.id, contribution);
    });

    memberContributions.forEach(contribution => {
      contributions.set(contribution.id, contribution);
    });

    return Array.from(contributions.values());
  }

  async inviteUsersToContribution(contributionId: string, userEmails: string[]): Promise<void> {
    console.log("inviteUsersToContribution called");
    if(!Array.isArray(userEmails) || userEmails.length === 0){
      throw new CustomError(StatusCodes.BAD_REQUEST, "Emails must be an array with at least one email.")
    }
    console.log("Invite Users called with emails: ", userEmails);
    const users = await db.user.findMany({
      where: {
        email: {
          in: userEmails
        },
      },
      select: {
        id: true,
        email: true
      }
    })
    console.log("Fetched users:", users);
    console.log("Type of users:", typeof users, Array.isArray(users));

    if(users.length === 0){
      throw new CustomError(StatusCodes.BAD_REQUEST, "No users found with the provided emails")
    }

    const invitationsData = users.map(user => ({
      contributionId,
      userId: user.email,
      status: ContributionInvitationStatus.PENDING

    }));
    console.log("Invitation data to be created:", invitationsData);

    const createResult = await db.contributionInvitation.createMany({
      data: invitationsData
    });

    console.log("Invitation creation result:", createResult);
    
    const userArray = Array.isArray(users) ? users : [] 
     await db.contributionInvitation.createMany({
        data: userArray.map(user => ({ 
        contributionId, 
        userId: user.id, 
        status: "PENDING" 
        }))
      }) 
    
  }

  async verifyIdentityAndJoin(userId: string, contributionId: string, verificationData: any): Promise<ContributionMember> {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "User identity verification failed.");
    }

    const member = await db.contributionMember.create({
      data: { userId, contributionId, status: PaymentStatus.UNPAID },
    });
    await db.contributionInvitation.update({
      where: { id: contributionId },
      data:{
        status: "ACCEPTED",
      }
    })

    return member;
  }

  async agreeToPaymentTerms(userId: string, contributionId: string): Promise<void> {
    await db.contributionMember.updateMany({
      where: { userId, contributionId },
      data: { agreedToTerms: true },
    });
  }

   async assignContributionTurns(contributionId: string): Promise<void> {
    const members = await db.contributionMember.findMany({
      where: { contributionId },
      orderBy: { joinedAt: "asc" },
    });

    if (!members.length) {
      throw new Error("No members found for this contribution");
    }

    for (let i = 0; i < members.length; i++) {
      await db.contributionMember.update({
        where: { id: members[i].id },
        data: { turnOrder: i + 1 },
      });
    }
  }

  async startContributionCycle(contributionId: string): Promise<void> {
    const contribution = await db.contribution.findUnique({
      where: { id: contributionId },
      include: { members: true },
    });

    if (!contribution || contribution.members.length === 0) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "No active members to start cycle.");
    }

    await db.contribution.update({
      where: { id: contributionId },
      data: { cycleActive: true },
    });
  }

  async holdFundsInEscrow(contributionId: string, amount: number): Promise<void> {
    const contribution = await db.contribution.findUnique({ where: { id: contributionId } });
    if (!contribution) throw new CustomError(StatusCodes.NOT_FOUND, "Contribution not found.");

    await db.contribution.update({
      where: { id: contributionId },
      data: { escrowBalance: contribution.escrowBalance + amount },
    });
  }

  async enforceTrustBuildingPeriod(contributionId: string): Promise<void> {
    const contribution = await db.contribution.findUnique({ where: { id: contributionId } });
    if (!contribution) throw new CustomError(StatusCodes.NOT_FOUND, "Contribution not found.");

    if (contribution.trustPeriodActive) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Payouts are not allowed during the trust period.");
    }
  }

  async processPayouts(contributionId: string): Promise<void> {
    const contribution = await db.contribution.findUnique({
       where: { id: contributionId },
       include: { members: true }, 
      });
    if (!contribution) throw new CustomError(StatusCodes.NOT_FOUND, "Contribution not found.");

    if (contribution.trustPeriodActive) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Payouts are not allowed during the first 3 months.");
    }

    // Determine next recipient
    const nextPayer = await db.contributionMember.findFirst({
      where: { contributionId, status: PaymentStatus.UNPAID },
      orderBy: { createdAt: "asc" },
    });

    if (!nextPayer) return;

    const payoutAmount = contribution.amountPerUser * contribution.members.length ;
    await this.splitPayoutForSecurity(contributionId, payoutAmount);
  } 

  async splitPayoutForSecurity(contributionId: string, payoutAmount: number): Promise<void> {
    const secureHold = payoutAmount * 0.5; // Hold back 50% for security
    const releaseAmount = payoutAmount - secureHold;

    // Simulate payout and holdback
    await db.contribution.update({
      where: { id: contributionId },
      data: { escrowBalance: secureHold },
    });
  }

  async penalizeLatePayers(contributionId: string): Promise<void> {
    const overdueMembers = await db.contributionMember.findMany({
      where: { contributionId, status: PaymentStatus.UNPAID, dueDate: { lt: new Date() } },
    });

    await Promise.all(overdueMembers.map(async (member) => {
      await db.contributionMember.update({
        where: { id: member.id },
        data: { penaltyAmount: 100, status: PaymentStatus.LATE },
      });
    }));
  }

  async reassignForfeitedSpots(contributionId: string): Promise<void> {
    const forfeitedMembers = await db.contributionMember.findMany({
      where: { contributionId, status: PaymentStatus.LATE },
    });

    await Promise.all(forfeitedMembers.map(async (member) => {
      await db.contributionMember.update({
        where: { id: member.id },
        data: { forfeited: true },
      });
    }));
  }

  async finalizeContributionCycle(contributionId: string): Promise<void> {
    await db.contribution.update({
      where: { id: contributionId },
      data: { cycleActive: false },
    });
  }
}