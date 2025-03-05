import { StatusCodes } from "http-status-codes"
import { CustomError } from "../exceptions/error/customError.error"
import { db } from "../configs/db"
import { UserRole } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { CustomRequest } from "./auth.middleware"



export const isAdmin = async (
     req: CustomRequest,
     res: Response,
     next: NextFunction
): Promise<void> => {
    try{
        const user = await db.user.findUnique({
         where: {
             id: req.userAuth
         }
        })
 
        if(!user){
          throw new CustomError(StatusCodes.NOT_FOUND, "user not found")
        }
        if(user.role === UserRole.ADMIN){
           next()
        } else{
         throw new CustomError(StatusCodes.FORBIDDEN, "Access denied")
        }
     }catch(error){
         next(error)
     }
}
   