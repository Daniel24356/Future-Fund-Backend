import { IsNotEmpty, IsUUID, IsNumber, Min } from "class-validator";

export class PayContributionDTO {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @IsUUID()
    @IsNotEmpty()
    contributionId!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount!: number;
}
