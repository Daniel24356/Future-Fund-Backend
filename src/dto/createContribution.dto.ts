import { IsNotEmpty, IsUUID, IsNumber, Min, Length } from "class-validator";

export class CreateContributionDTO {
    @IsUUID()
    @IsNotEmpty()
    createdById!: string;

    @IsNotEmpty()
    @Length(3, 100)
    name!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amountPerUser!: number;

    @IsNotEmpty()
    @Length(3, 50)
    cycle!: string;
}
