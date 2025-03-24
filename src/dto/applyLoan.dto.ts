import { IsNotEmpty, IsNumber, Min, IsEnum, IsString } from "class-validator";

export class ApplyLoanDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(1000, { message: "Loan amount must be at least 1,000." })
  amount!: number;

  @IsNotEmpty()
  @IsString()
  homeAddress!: string;

  @IsNotEmpty()
  @IsEnum(["Employed", "Self-employed", "Business owner", "Student"], { message: "Invalid employment status." })
  employmentStatus!: string;

  @IsNotEmpty()
  @IsEnum(["Married", "Single", "Divorced", "Student"], { message: "Invalid marital status." })
  maritalStatus!: string;

  
  @IsNotEmpty({ message: "Account statement is required." })
  @IsString({ message: "Account statement must be a string (URL)." })
  accountStatement!: string;
}
