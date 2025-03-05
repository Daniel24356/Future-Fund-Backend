import { Loan } from "@prisma/client";
import { ApplyLoanDTO } from "../../dto/applyLoan.dto";
import { RepayLoanDTO } from "../../dto/repayLoan.dto";
import { LoanService } from "../loan.service";


export class LoanServiceImpl implements LoanService{
    applyForLoan(data: ApplyLoanDTO): Promise<Loan> {
        throw new Error("Method not implemented.");
    }
    updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED"): Promise<Loan> {
        throw new Error("Method not implemented.");
    }
    repayLoan(data: RepayLoanDTO): Promise<Loan> {
        throw new Error("Method not implemented.");
    }
    getUserLoans(userId: string): Promise<Loan[]> {
        throw new Error("Method not implemented.");
    }
    
}