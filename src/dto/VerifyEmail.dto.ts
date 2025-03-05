import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";



export class VerifyEmailDTO {
    @IsString()
    @IsEmail()
    email!: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    otp!: string;
  }