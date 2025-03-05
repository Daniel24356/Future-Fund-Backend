import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class ApplyLoanDTO {
    @IsNotEmpty()
    @IsNumber()
    @Min(1000)
    amount!: number;

    @IsNotEmpty()
    @IsNumber()
    interestRate!: number;

    @IsNotEmpty()
    @IsNumber()
    totalRepayable!: number;

    @IsNotEmpty()
    @IsNumber()
    monthlyPayment!: number;
}
