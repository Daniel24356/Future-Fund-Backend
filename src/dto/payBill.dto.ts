import { IsNotEmpty, IsNumber, Min, IsUUID, Length } from "class-validator";

export class PayBillDTO {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @IsNotEmpty()
    @Length(3, 100)
    service!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount!: number;

    @IsNotEmpty()
    @Length(6, 50)
    referenceId!: string;
}
