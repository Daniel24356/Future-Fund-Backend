import { IsEmail, IsEmpty, IsString } from "class-validator";

export class loginDTO {
    @IsEmail()
    email!: string

    @IsString()
    @IsEmpty()
    password!: string
}