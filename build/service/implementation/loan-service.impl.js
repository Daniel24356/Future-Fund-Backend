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
const CloudinaryUploader_1 = require("../../utils/CloudinaryUploader");
class LoanServiceImpl {
    applyForLoan(data, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const FIXED_INTEREST_RATE = 10;
            const FIXED_TERM = 6;
            const CREDIT_DEDUCTION = 20;
            const user = yield db_1.db.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error("User not found.");
            }
            if (user.creditScore < 100) {
                throw new Error("Insufficient credit score. You need at least 100 to apply for a loan.");
            }
            const existingLoan = yield db_1.db.loan.findFirst({
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
            let accountStatementUrl;
            if (file) {
                try {
                    const uploadResponse = yield (0, CloudinaryUploader_1.uploadFileToCloudinary)(file.buffer, "account_statements");
                    accountStatementUrl = uploadResponse.secure_url;
                }
                catch (error) {
                    throw new Error("File upload failed. Please try again.");
                }
            }
            else if (data.accountStatement) {
                accountStatementUrl = data.accountStatement;
            }
            else {
                throw new Error("Account statement file is required.");
            }
            const interest = (loanAmount * FIXED_INTEREST_RATE) / 100;
            const totalRepayable = loanAmount + interest;
            const dueAmount = totalRepayable / FIXED_TERM;
            const dueDate = new Date();
            if (loanAmount <= 1000) {
                dueDate.setDate(dueDate.getDate() + 14);
            }
            else if (loanAmount <= 5000) {
                dueDate.setMonth(dueDate.getMonth() + 1);
            }
            else {
                dueDate.setMonth(dueDate.getMonth() + 2);
            }
            return yield db_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.user.update({
                    where: { id: userId },
                    data: { creditScore: user.creditScore - CREDIT_DEDUCTION },
                });
                return yield tx.loan.create({
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
            }));
        });
    }
    updateLoanStatus(loanId, status) {
        throw new Error("Method not implemented.");
    }
    repayLoan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan = yield db_1.db.loan.findFirst({
                where: {
                    userId,
                    status: 'ACTIVE',
                },
            });
            if (!loan) {
                throw new Error("Loan not found or Unauthorized");
            }
            const updatedLoan = yield db_1.db.loan.update({
                where: { id: loan.id },
                data: {
                    paidAmount: loan.totalRepayable,
                    status: 'PAID',
                },
            });
            yield db_1.db.transaction.create({
                data: {
                    userId,
                    type: "LOAN_REPAYMENT",
                    amount: loan.totalRepayable,
                    description: `Repayment for loan ${loan.id}`,
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
    getUserActiveLoan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeLoan = yield db_1.db.loan.findFirst({
                where: {
                    userId,
                    status: 'ACTIVE',
                },
            });
            return activeLoan;
        });
    }
}
exports.LoanServiceImpl = LoanServiceImpl;
