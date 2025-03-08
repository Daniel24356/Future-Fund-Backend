import { Loan } from "@prisma/client";
import { ApplyLoanDTO } from "../../dto/applyLoan.dto";
import { RepayLoanDTO } from "../../dto/repayLoan.dto";
import { LoanService } from "../loan.service";
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
    updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED"): Promise<Loan> {
        throw new Error("Method not implemented.");
    }

    async repayLoan(data: RepayLoanDTO, userId: string): Promise<Loan> {
        const loan = await prisma.loan.findUnique({
            where: { id: data.loanId, userId },
        });
    
        if (!loan) {
            throw new Error("Loan not found or Unauthorized");
        }
    
        if (loan.status !== "ACTIVE") {
            throw new Error("LOAN IS NOT APPROVED YET");
        }
    
        const newPaidAmount = loan.paidAmount + data.amount;
        const newStatus = newPaidAmount >= loan.totalRepayable ? "PAID" : "ACTIVE";
    
        const updatedLoan = await prisma.loan.update({
            where: { id: data.loanId },
            data: {
                paidAmount: newPaidAmount,
                status: newStatus,
            },
        });
    
        await prisma.transaction.create({
            data: {
                userId,
                type: "LOAN_REPAYMENT",
                amount: data.amount,
                description: `Repayment for loan ${data.loanId}`,
            },
        });
    
        return updatedLoan;
    }
    
    getUserLoans(userId: string): Promise<Loan[]> {
        throw new Error("Method not implemented.");
    }
    
}