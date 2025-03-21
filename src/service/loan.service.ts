import { Loan } from "@prisma/client";
import { ApplyLoanDTO } from "../dto/applyLoan.dto";
import { RepayLoanDTO } from "../dto/repayLoan.dto";
import { GetUserLoanDto } from "../dto/getUserloan.dto"

export interface GetUserLoanResponse {
  loans: Loan[];
  limit: number;
  cursor: string | null;
}

export interface LoanService {
  applyForLoan(data: ApplyLoanDTO, userId: string): Promise<Loan>;
  repayLoan(userId: string): Promise<Loan>; 
  updateLoanStatus(loanId: string, status: "APPROVED" | "REJECTED"): Promise<Loan | null>; // ✅ Allow null
  getUserLoans(userId: string, dto: GetUserLoanDto): Promise<GetUserLoanResponse>;
}
