import { IsEmpty, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class ChangePasswordDTO{
    @IsNotEmpty()
    @IsString()
    oldPassword!: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(5,35)
    newPassword!: string;
}