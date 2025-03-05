import { Contribution, ContributionMember } from "@prisma/client";
import { CreateContributionDTO } from "../../dto/createContribution.dto";
import { JoinContributionDTO } from "../../dto/joinContribution.dto";
import { PayContributionDTO } from "../../dto/payContribution.dto";
import { ContributionService } from "../contribution.service";


export class ContributionServiceImpl implements ContributionService{
    createContribution(data: CreateContributionDTO): Promise<Contribution> {
        throw new Error("Method not implemented.");
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