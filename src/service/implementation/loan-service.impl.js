"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanServiceImpl = void 0;
const db_1 = require("../../configs/db");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LoanServiceImpl {
    applyForLoan(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const FIXED_INTEREST_RATE = 10;
            const FIXED_TERM = 6;
            const interest = (data.amount * FIXED_INTEREST_RATE) / 100;
            const totalRepayable = data.amount + interest;
            const dueAmount = totalRepayable / FIXED_TERM;
            const dueDate = new Date();
            if (data.amount <= 100000) {
                dueDate.setDate(dueDate.getDate() + 14);
            }
            else if (data.amount <= 500000) {
                dueDate.setMonth(dueDate.getMonth() + 1);
            }
            else if (data.amount <= 2000000) {
                dueDate.setMonth(dueDate.getMonth() + 2);
            }
            else {
                dueDate.setMonth(dueDate.getMonth() + 3);
            }
            const loan = yield prisma.loan.create({
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
            return loan;
        });
    }
    updateLoanStatus(loanId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loan = yield prisma.loan.findUnique({ where: { id: loanId } });
                if (!loan) {
                    throw new Error("Loan not found");
                }
                const updatedLoan = yield prisma.loan.update({
                    where: { id: loanId },
                    data: { status: newStatus }
                });
                return updatedLoan;
            }
            catch (error) {
                console.error("Error updating loan status:", error);
                throw new Error("Failed to update loan status");
            }
        });
    }
    repayLoan(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan = yield prisma.loan.findUnique({
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
            const updatedLoan = yield prisma.loan.update({
                where: { id: data.loanId },
                data: {
                    paidAmount: newPaidAmount,
                    status: newStatus,
                },
            });
            yield prisma.transaction.create({
                data: {
                    userId,
                    type: "LOAN_REPAYMENT",
                    amount: data.amount,
                    description: `Repayment for loan ${data.loanId}`,
                },
            });
            return updatedLoan;
        });
    }
    getUserLoans(userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const limit = dto.limit ? parseInt(dto.limit) : 50;
            let query = {
                where: { userId },
                take: limit,
                orderBy: { createdAt: 'desc' },
            };
            if (dto.cursor) {
                query = Object.assign(Object.assign({}, query), { skip: 1, cursor: { id: dto.cursor } });
            }
            const loans = yield db_1.db.loan.findMany(query);
            const nextCursor = loans.length === limit ? (_a = loans[loans.length - 1]) === null || _a === void 0 ? void 0 : _a.id : null;
            return {
                loans,
                cursor: nextCursor,
                limit,
            };
        });
    }
}
exports.LoanServiceImpl = LoanServiceImpl;
