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
exports.LoanController = void 0;
const loan_service_impl_1 = require("../service/implementation/loan-service.impl");
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LoanController {
    constructor() {
        this.applyForLoan = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customReq = req;
                const userId = customReq.userAuth;
                if (!userId) {
                    res.status(401).json({ message: "Unauthorized: User ID is missing" });
                    return;
                }
                const data = req.body;
                yield this.loanService.applyForLoan(data, userId);
                res.status(201).json({ message: "Loan application submitted successfully" });
                return;
            }
            catch (error) {
                next(error);
            }
        });
        this.repayLoan = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userAuth;
                if (!userId) {
                    res.status(401).json({ message: "Unauthorized: User ID is missing" });
                    return;
                }
                const repaymentResult = yield this.loanService.repayLoan(req.body, userId);
                res.status(200).json({
                    message: "Loan repayment successful",
                    data: repaymentResult,
                });
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : "An error occurred during loan repayment";
                res.status(400).json({ message: errMsg });
            }
        });
        this.getUserLoans = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userAuth;
                const results = yield this.loanService.getUserLoans(userId, req.query);
                res.status(http_status_codes_1.StatusCodes.OK).send(results);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateLoanStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { loanId } = req.body;
                const { newStatus } = req.body;
                if (!loanId || !newStatus) {
                    res.status(400).json({ message: "Loan ID and new status are required" });
                    return;
                }
                if (!["APPROVED", "REJECTED"].includes(newStatus)) {
                    res.status(400).json({ message: "Invalid loan status" });
                    return;
                }
                const updatedLoan = yield this.loanService.updateLoanStatus(loanId, newStatus);
                if (!updatedLoan) {
                    res.status(404).json({ message: "Loan not found" });
                    return;
                }
                res.status(200).json({ message: "Loan status updated successfully", loan: updatedLoan });
            }
            catch (error) {
                console.error("Error updating loan status:", error);
                next(error);
            }
        });
        this.loanService = new loan_service_impl_1.LoanServiceImpl();
    }
}
exports.LoanController = LoanController;
