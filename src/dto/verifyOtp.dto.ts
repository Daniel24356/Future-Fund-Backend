import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";



export class VerifyOtpDTO {
    @IsString()
    @IsNotEmpty()
    phoneNumber!: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    otp!: string;
  }