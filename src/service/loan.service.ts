import { Loan } from "@prisma/client";
import { ApplyLoanDTO } from "../dto/applyLoan.dto";
import { RepayLoanDTO } from "../dto/repayLoan.dto";

export interface LoanService {
  applyForLoan(data: ApplyLoanDTO): Promise<Loan>;
  updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED"): Promise<Loan>;
  repayLoan(data: RepayLoanDTO): Promise<Loan>;
  getUserLoans(userId: string): Promise<Loan[]>;
}
