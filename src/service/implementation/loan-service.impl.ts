import { Loan, Prisma } from "@prisma/client";
import { ApplyLoanDTO } from "../../dto/applyLoan.dto";
import { RepayLoanDTO } from "../../dto/repayLoan.dto";
import { GetUserLoanResponse, LoanService } from "../loan.service";
import { db } from "../../configs/db";
import { GetUserLoanDto } from "../../dto/getUserloan.dto";
import { PrismaClient } from "@prisma/client";
import { uploadFileToCloudinary } from "../../utils/CloudinaryUploader";

export class LoanServiceImpl implements LoanService{
    async applyForLoan(data: ApplyLoanDTO, userId: string, file?: Express.Multer.File): Promise<Loan> {
        const FIXED_INTEREST_RATE = 10;
        const FIXED_TERM = 6;
        const CREDIT_DEDUCTION = 20;
    
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found.");
        }
    
        if (user.creditScore < 100) {
            throw new Error("Insufficient credit score. You need at least 100 to apply for a loan.");
        }
    
        const existingLoan = await db.loan.findFirst({
            where: { userId, status: { not: "PAID" } },
        });
    
        if (existingLoan) {
            throw new Error("You must fully repay your current loan before applying again.");
        }
    
        const loanAmount = Number(data.amount);
        if (isNaN(loanAmount) || loanAmount <= 0) {
            throw new Error("Invalid loan amount.");
        }
    
        if (loanAmount > 10000) {
            throw new Error("Loan amount exceeds the maximum limit of $10,000.");
        }
    
        let accountStatementUrl: string | undefined;
    
       
        if (file) {
            try {
                const uploadResponse = await uploadFileToCloudinary(file.buffer, "account_statements");
                accountStatementUrl = uploadResponse.secure_url;
            } catch (error) {
                throw new Error("File upload failed. Please try again.");
            }
        } else if (data.accountStatement) {
            accountStatementUrl = data.accountStatement;
        } else {
            throw new Error("Account statement file is required.");
        }
    
        const interest = (loanAmount * FIXED_INTEREST_RATE) / 100;
        const totalRepayable = loanAmount + interest;
        const dueAmount = totalRepayable / FIXED_TERM;
    
        const dueDate = new Date();
        if (loanAmount <= 1000) {
            dueDate.setDate(dueDate.getDate() + 14);
        } else if (loanAmount <= 5000) {
            dueDate.setMonth(dueDate.getMonth() + 1);
        } else {
            dueDate.setMonth(dueDate.getMonth() + 2);
        }
    
        return await db.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { creditScore: user.creditScore - CREDIT_DEDUCTION },
            });
    
            return await tx.loan.create({
                data: {
                    userId,
                    amount: loanAmount,
                    term: FIXED_TERM,
                    interestRate: FIXED_INTEREST_RATE,
                    totalRepayable,
                    dueAmount,
                    dueDate,
                    paidAmount: 0,
                    status: "PENDING",
                    accountStatement: accountStatementUrl,
                    homeAddress: data.homeAddress,
                },
            });
        });
    }

      



    
    updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED"): Promise<Loan> {
        throw new Error("Method not implemented.");
    }

    async repayLoan(userId: string): Promise<Loan> {
        const loan = await db.loan.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
            },
        });
    
        if (!loan) {
            throw new Error("Loan not found or Unauthorized");
        }
    
        const updatedLoan = await db.loan.update({
            where: { id: loan.id },
            data: {
                paidAmount: loan.totalRepayable,
                status: 'PAID',
            },
        });
    
        await db.transaction.create({
            data: {
                userId,
                type: "LOAN_REPAYMENT",
                amount: loan.totalRepayable,
                description: `Repayment for loan ${loan.id}`,
            },
        });
    
        return updatedLoan;
    }

    async getUserLoans(userId: string, dto: GetUserLoanDto): Promise<GetUserLoanResponse> {
        const limit = dto.limit ? parseInt(dto.limit) : 50;
    
        let query: Prisma.LoanFindManyArgs = {
            where: { userId },
            take: limit,
            orderBy: { createdAt: 'desc' },
        };
    
        if (dto.cursor) {
            query = {
                ...query,
                skip: 1,
                cursor: { id: dto.cursor } 
            };
        }
    
        const loans = await db.loan.findMany(query);
        const nextCursor = loans.length === limit ? loans[loans.length - 1]?.id : null; 
    
        return {
            loans,
            cursor: nextCursor,
            limit,
        };
    }

     async getUserActiveLoan(userId: string) {
        const activeLoan = await db.loan.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
            },
        });

        return activeLoan;
    }
    
}


   

