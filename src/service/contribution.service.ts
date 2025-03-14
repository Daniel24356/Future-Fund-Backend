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
}
