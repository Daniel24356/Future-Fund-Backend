import { User } from "@prisma/client";
import { db } from "../../configs/db";
import { loginDTO } from "../../dto/login.dto";
import { VerifyEmailDTO } from "../../dto/VerifyEmail.dto";
import { CustomError } from "../../exceptions/error/customError.error";
import { comparePassword, hostPassword } from "../../utils/password.utils";
import { AuthService } from "../auth.service";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { generateOtp } from "../../utils/otp.util";
import { sendOtpEmail, welcomeEmail } from "../../Design/Email";
import  twilio  from "twilio";
import { VerifyOtpDTO } from "../../dto/verifyOtp.dto";
import InfobipService  from '../infobob.service'; 


export class AuthServiceImp implements AuthService {
    async login(data: loginDTO): Promise<{ accessToken: string; refreshToken: string; }> {

        const isUserExist = await db.user.findUnique({
          where: {
            email: data.email
          },
        })

        if (!isUserExist) {
            throw new CustomError(401, "Invalid password or email");
        }

        const isPasswordValid = await comparePassword(data.password, isUserExist.password || '')
        if (!isPasswordValid) {
            throw new CustomError(401, "invalid password or email");
        }

        const fullname = isUserExist.firstName + " " + isUserExist.lastName
        const accessToken = this.generateAcessToken(isUserExist.id, fullname, isUserExist.role);

        const refreshToken = this.generateRefreshToken(
            isUserExist.id,
            fullname,
            isUserExist.role
        );

        return { accessToken, refreshToken };
    }

    async createUser(data: CreateUserDTO): Promise<User> {
        const otp = generateOtp();
        const isUserExist = await db.user.findFirst({
          where: {
            email: data.email,
          },
        });
    
        if (isUserExist) {
          throw new CustomError(409, "oops email already taken");
        }
    
        const hashedOtp = await hostPassword(otp);
        const maRetries = 3;
        for (let attempt = 1; attempt <= maRetries; attempt++) {
          try {
            return await db.$transaction(async (transaction) => {
              const user = await transaction.user.create({
                data: {
                  email: data.email,
                  password: await hostPassword(data.password),
                  firstName: data.firstName,
                  lastName: data.lastName,
                  role: data.role,
                  otp: hashedOtp,
                  otpExpiry: this.generateOtpExpiration().toString(),
                },
              });
    
              await sendOtpEmail({
                to: data.email,
                subject: "Verify your email",
                otp,
              });
              return user;
            });
          } catch (error) {
            console.warn(`Retry ${attempt} due to transaction failure, error`);
            if (attempt === maRetries) {
              throw new CustomError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to create user after multiple retry"
              );
            }
          }
        }
        throw new CustomError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Unexpected error during user creation"
        );
    
       
      }

    async verifyEmail(data: VerifyEmailDTO): Promise<User> {
        const user = await db.user.findFirst({
          where: {
            email: data.email,
          },
        });
    
        if (!user) {
          throw new CustomError(StatusCodes.NOT_FOUND, "Email not found");
        }
        if (user.emailVerified) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified");
        }
        if (!user.otp || !user.otpExpiry) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            "OTP is not available for this user"
          );
        }
    
        const isOtPValid = await comparePassword(data.otp, user.otp);
        if (!isOtPValid) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
        }
    
        const isExpiredOtp = Number(user.otpExpiry) < Number(new Date());
    
        if (isExpiredOtp) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired");
        }
    
        const userReg = await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: true,
            otp: null,
            otpExpiry: null,
          },
        });
        //
    
        await welcomeEmail({
          to: userReg.email,
          subject: "Welcome to Futurerify",
          name: userReg.firstName + " " + userReg.lastName,
        });
    
        return userReg;
      }


    generateAcessToken(userId: string, name: string, role: string): string {
        return jwt.sign({ id: userId, name: role }, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
        })
    }

    generateRefreshToken(userId: string, name: string, role: string): string {
        return jwt.sign({ id: userId, name: role }, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        })
    }

    generateOtpExpiration() {
        return new Date(Date.now() + 10 * 60 * 1000)
    }

}