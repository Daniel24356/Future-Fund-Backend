import { Loan, PrismaClient } from "@prisma/client";
import { ApplyLoanDTO } from "../../dto/applyLoan.dto";
import { RepayLoanDTO } from "../../dto/repayLoan.dto";
import { LoanService } from "../loan.service";

const prisma = new PrismaClient();

export class LoanServiceImpl implements LoanService{
    applyForLoan(data: ApplyLoanDTO): Promise<Loan> {
        throw new Error("Method not implemented.");
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
    repayLoan(data: RepayLoanDTO): Promise<Loan> {
        throw new Error("Method not implemented.");
    }
    getUserLoans(userId: string): Promise<Loan[]> {
        throw new Error("Method not implemented.");
    }
    
}