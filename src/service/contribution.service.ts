import { Contribution, ContributionMember } from "@prisma/client";
import { CreateContributionDTO } from "../dto/createContribution.dto";
import { JoinContributionDTO } from "../dto/joinContribution.dto";
import { PayContributionDTO } from "../dto/payContribution.dto";

export interface ContributionService {
  createContribution(id: string, data: CreateContributionDTO): Promise<Contribution>;
  joinContribution(data: JoinContributionDTO): Promise<ContributionMember>;
  payContribution(data: PayContributionDTO): Promise<ContributionMember>;
  getUserContributions(userId: string): Promise<ContributionMember[]>;
  getAllContributionMembers(contributionId: string): Promise<ContributionMember[]>;
  inviteUsersToContribution(contributionId: string, userIds: string[]): Promise<void>;
  verifyIdentityAndJoin(userId: string, contributionId: string, verificationData: any): Promise<ContributionMember>;
  assignContributionTurns(contributionId: string): Promise<void>
  agreeToPaymentTerms(userId: string, contributionId: string): Promise<void>;
  startContributionCycle(contributionId: string): Promise<void>;
  holdFundsInEscrow(contributionId: string, amount: number): Promise<void>;
  enforceTrustBuildingPeriod(contributionId: string): Promise<void>;
  processPayouts(contributionId: string): Promise<void>;
  splitPayoutForSecurity(contributionId: string, payoutAmount: number): Promise<void>;
  penalizeLatePayers(contributionId: string): Promise<void>;
  reassignForfeitedSpots(contributionId: string): Promise<void>;
  finalizeContributionCycle(contributionId: string): Promise<void>;
}
