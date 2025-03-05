import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { UserService } from "../user-service";
import { CustomError } from "../../exceptions/error/customError.error";
import { db } from "../../configs/db";
import { comparePassword, hostPassword } from "../../utils/password.utils";
import { StatusCodes } from "http-status-codes";
import { ChangePasswordDTO } from "../../dto/resetPassword.auth.dto";
import ChangePassword from "../../Design/changeSucces";

export class UserServiceImpl implements UserService {
         
    async createUser(data: CreateUserDTO): Promise<User> {
        const isUserExist = await db.user.findFirst({
            where: { email: data.email },
        });
        
        if (isUserExist) {
            throw new CustomError(409, "Oops, email already taken");
        }
        
        const user = await db.user.create({
            data: {
                email: data.email,
                password: await hostPassword(data.password),
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                phoneNumber: data.phoneNumber || null,
                profilePicture: data.profilePicture || null,
                balance: 0.0, // Default balance
            },
        });
        return user;
    }
    
    async getUserById(id: string): Promise<User | null> {
        const user = await db.user.findUnique({
            where: { id },
        });
       
        if (!user) {
            throw new CustomError(404, `User with ID ${id} does not exist`);
        }
        return user;
    }
    
    async getAllUsers(): Promise<User[]> {
        return await db.user.findMany();
    }
    
    async updateUser(id: string, data: Partial<CreateUserDTO>): Promise<User> {
        const isUserExist = await db.user.findFirst({ where: { id } });
        
        if (!isUserExist) {
            throw new CustomError(404, `No user found with ID ${id}`);
        }
        
        const user = await db.user.update({
            where: { id },
            data,
        });
        return user;
    }

    async deleteUser(id: string): Promise<void> {
        await db.user.delete({ where: { id } });
    }

    async profile(id: string): Promise<Omit<User, "password">> {
        const user = await db.user.findFirst({ where: { id } });
        
        if (!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, `User with ID ${id} not found`);
        }
        
        const { password, ...userData } = user;
        return userData;
    }

    async updateProfilePic(
      id: string,
      data: { profilePicture: string }
    ): Promise<Omit<User, "password">> {
      if (!id || typeof id !== "string") {
        throw new Error("Invalid ID provided.");
      }
    
      console.log("Received ID for update:", id);
    
      const user = await db.user.findUnique({
        where: { id },
      });
    
      if (!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
      }
    
      const updatedUser = await db.user.update({
        where: { id },
        data: { profilePicture: data.profilePicture },
      });
    
      console.log("Updated User:", updatedUser);
    
      // Return updated user without the password field
      return {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        balance: updatedUser.balance,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        profilePicture: updatedUser.profilePicture,
        otp: updatedUser.otp,
        otpExpiry: updatedUser.otpExpiry,
        emailVerified: updatedUser.emailVerified,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    }
    

    async updateBalance(id: string, amount: number): Promise<User> {
        const user = await db.user.findUnique({ where: { id } });
        
        if (!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
        }
        
        const updatedUser = await db.user.update({
            where: { id },
            data: { balance: user.balance + amount },
        });
        
        return updatedUser;
    }

    async setPassword(id: string, data: ChangePasswordDTO): Promise<void> {
        await db.$transaction(async (transaction) => {
            const user = await transaction.user.findUnique({ where: { id } });
            
            if (!user) {
                throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
            }
            
            const isPasswordValid = await comparePassword(
                data.oldPassword,
                user.password || ""
            );
            
            if (!isPasswordValid) {
                throw new CustomError(400, "Current password is incorrect");
            }
            
            const previousPasswords = await transaction.passwordHistory.findMany({
                where: { userId: id },
                select: { passwordHash: true },
            });
            
            for (const history of previousPasswords) {
                const isPreviouslyUsed = await comparePassword(
                    data.newPassword,
                    history.passwordHash
                );
                
                if (isPreviouslyUsed) {
                    throw new CustomError(400, "The new password has been used before. Please choose a different password");
                }
            }
            
            if (user.password) {
                await transaction.passwordHistory.create({
                    data: { userId: user.id, passwordHash: user.password },
                });
            }
            
            const hashedPassword = await hostPassword(data.newPassword);
            await transaction.user.update({ where: { id }, data: { password: hashedPassword } });
            
            const passwordHistoryCount = await transaction.passwordHistory.count({ where: { userId: id } });
            
            if (passwordHistoryCount > 5) {
                const oldestPassword = await transaction.passwordHistory.findFirst({
                    where: { userId: id },
                    orderBy: { createdAt: "asc" },
                });
                
                if (oldestPassword) {
                    await transaction.passwordHistory.delete({ where: { id: oldestPassword.id } });
                }
            }
            
            await ChangePassword({
                to: user.email,
                subject: "Password Change Notification",
                name: user.firstName + " " + user.lastName,
            });
        });
    }
}
