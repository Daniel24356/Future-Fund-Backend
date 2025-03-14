import { ContributionCycle } from "@prisma/client";
import { IsNotEmpty, IsUUID, IsNumber, Min, Length, IsEnum } from "class-validator";

export class CreateContributionDTO {

    @IsNotEmpty()
    @Length(3, 100)
    name!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amountPerUser!: number

    @IsNotEmpty()
    @IsEnum(ContributionCycle)
    cycle!: ContributionCycle

    @IsNotEmpty()
    @IsNumber()
    maxMembers!: number
}
