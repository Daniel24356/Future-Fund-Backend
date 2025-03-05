import { NextFunction, Request, Response } from "express";
import { AuthServiceImp } from "../service/implementation/auth.service.implementation";
import { CustomError } from "../exceptions/error/customError.error";
import { loginDTO } from "../dto/login.dto";
import { CreateUserDTO } from "../dto/createUser.dto";
import { VerifyEmailDTO } from "../dto/VerifyEmail.dto";
import { VerifyOtpDTO } from "../dto/verifyOtp.dto";



export class AuthController {
  private authService: AuthServiceImp;

  constructor(){
    this.authService = new AuthServiceImp();
  }

  public login = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try{
    const data: loginDTO = req.body
    const {accessToken, refreshToken} = await this.authService.login(data);
    res.status(200).json({accessToken, refreshToken});   
   }catch(error){
      next(error)
    }
  }

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateUserDTO = req.body;
      const user = await this.authService.createUser(data);
      res.status(201).json({
        error: false,
        message: `Otp has been sent successfully to your email @ ${user.email}`,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: VerifyEmailDTO = req.body;
      const user = await this.authService.verifyEmail(data);
      res.status(201).json({
        error: false,
        message: `You have successfully registered`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

 
}