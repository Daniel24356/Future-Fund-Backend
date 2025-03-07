import { Loan, PrismaClient } from "@prisma/client";
import { ApplyLoanDTO } from "../../dto/applyLoan.dto";
import { RepayLoanDTO } from "../../dto/repayLoan.dto";
import { LoanService } from "../loan.service";

const prisma = new PrismaClient();

export class LoanServiceImpl implements LoanService{
    applyForLoan(data: ApplyLoanDTO): Promise<Loan> {
        throw new Error("Method not implemented.");
    }
    async updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED"): Promise<Loan> {
        try {
            const loan = await prisma.loan.findUnique({
                where: { id: loanId },
            });

            if (!loan) {
                throw new Error("Loan not found");
            }

            const updatedLoan = await prisma.loan.update({
                where: { id: loanId },
                data: { status },
            });

            return updatedLoan;
        } catch (error: unknown) {  
            const err = error as Error; 
            console.error("Error updating loan status:", err.message);
            throw new Error(err.message); 
        }
    }
    repayLoan(data: RepayLoanDTO): Promise<Loan> {
        throw new Error("Method not implemented.");
    }
    getUserLoans(userId: string): Promise<Loan[]> {
        throw new Error("Method not implemented.");
    }
    
}