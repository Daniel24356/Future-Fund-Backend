import { Loan, Prisma } from "@prisma/client";
import { ApplyLoanDTO } from "../../dto/applyLoan.dto";
import { RepayLoanDTO } from "../../dto/repayLoan.dto";
import { GetUserLoanResponse, LoanService } from "../loan.service";
import { db } from "../../configs/db";
import { GetUserLoanDto } from "../../dto/getUserLoan.dto";

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
                cursor: { cursor: parseInt(dto.cursor) }
            };
        }

        const loans = await db.loan.findMany(query);
        const cursor = loans[limit - 1]?.cursor ?? null;

        return {
            loans,
            cursor,
            limit,
        };
    }
}