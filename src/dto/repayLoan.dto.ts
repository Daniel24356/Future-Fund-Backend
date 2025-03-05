import { IsNotEmpty, IsNumber, Min, IsUUID } from "class-validator";

export class RepayLoanDTO {
    @IsUUID()
    @IsNotEmpty()
    loanId!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(100)
    amount!: number;
}
