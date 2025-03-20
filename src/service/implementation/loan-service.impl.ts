import { Loan, Prisma } from "@prisma/client";
import { ApplyLoanDTO } from "../../dto/applyLoan.dto";
import { RepayLoanDTO } from "../../dto/repayLoan.dto";
import { GetUserLoanResponse, LoanService } from "../loan.service";
import { db } from "../../configs/db";
import { GetUserLoanDto } from "../../dto/getUserloan.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LoanServiceImpl implements LoanService{
    async applyForLoan(data: ApplyLoanDTO, userId: string): Promise<Loan> {
        const FIXED_INTEREST_RATE = 10;
        const FIXED_TERM = 6;

        const interest = (data.amount * FIXED_INTEREST_RATE) / 100;
        const totalRepayable = data.amount + interest;

        const dueAmount = totalRepayable / FIXED_TERM;

        const dueDate = new Date();
        if (data.amount <= 100000){
            dueDate.setDate(dueDate.getDate() + 14);
        }else if (data.amount <= 500000){
            dueDate.setMonth(dueDate.getMonth() + 1);
        }else if (data.amount <= 2000000){
            dueDate.setMonth(dueDate.getMonth() + 2);
        }else {
            dueDate.setMonth(dueDate.getMonth() + 3);
        }

        return await prisma.loan.create({
            data: {
                userId,
                amount: data.amount,
                term: FIXED_TERM,
                interestRate: FIXED_INTEREST_RATE,
                totalRepayable,
                dueAmount, 
                dueDate, 
                paidAmount: 0,
                status: "PENDING",
            },
        });

    }
    async updateLoanStatus(loanId: string, newStatus: "APPROVED" | "REJECTED"): Promise<Loan | null> {
        try {
           
            const loan = await prisma.loan.findUnique({ where: { id: loanId } });

            if (!loan) {
                throw new Error("Loan not found");
            }

            
            const updatedLoan = await prisma.loan.update({
                where: { id: loanId },
                data: { status: newStatus }
            });

            return updatedLoan;
        } catch (error) {
            console.error("Error updating loan status:", error);
            throw new Error("Failed to update loan status");
        }
    }

    async repayLoan(userId: string): Promise<Loan> {
        const loan = await prisma.loan.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
            },
        });
    
        if (!loan) {
            throw new Error("Loan not found or Unauthorized");
        }
    
        const updatedLoan = await prisma.loan.update({
            where: { id: loan.id },
            data: {
                paidAmount: loan.totalRepayable,
                status: 'PAID',
            },
        });
    
        await prisma.transaction.create({
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