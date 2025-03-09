import { IsNotEmpty, IsNumber, Min, IsDateString } from "class-validator";

export class ApplyLoanDTO {
    @IsNotEmpty()
    @IsNumber()
    @Min(1000)
    amount!: number;

    @IsNotEmpty()
    @IsNumber()
    dueAmount!: number; 

    @IsNotEmpty()
    @IsDateString()
    dueDate!: string; 

}
