import { IsOptional, IsString } from "class-validator";

export class GetUserLoanDto {
    @IsString()
    @IsOptional()
    limit?: string;

    @IsString()
    @IsOptional()
    cursor?: string;
}