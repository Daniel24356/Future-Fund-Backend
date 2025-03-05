import { IsNotEmpty, IsNumber, Min, IsUUID, IsOptional, IsEmail } from "class-validator";

export class WalletTransactionDTO {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount!: number;

    @IsOptional()
    description?: string;
}

export class TransferFundsDTO {
    @IsUUID()
    @IsNotEmpty()
    senderId!: string;

    @IsEmail()
    @IsNotEmpty()
    receiverEmail!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount!: number;
}
