import { IsNotEmpty, IsNumber, Min, IsUUID, Length } from "class-validator";

export class InvestDTO {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @IsNotEmpty()
    @Length(3, 100)
    plan!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1000)
    amount!: number;

    @IsNotEmpty()
    @IsNumber()
    interestRate!: number;

    @IsNotEmpty()
    @IsNumber()
    duration!: number;
}
