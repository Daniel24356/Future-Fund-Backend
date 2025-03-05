import { IsNotEmpty, IsUUID } from "class-validator";

export class JoinContributionDTO {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @IsUUID()
    @IsNotEmpty()
    contributionId!: string;
}
