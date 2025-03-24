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
const applyLoan_dto_1 = require("../dto/applyLoan.dto");
const CloudinaryUploader_1 = require("../utils/CloudinaryUploader");
const http_status_codes_1 = require("http-status-codes");
const class_validator_1 = require("class-validator");
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
                if (!customReq.file) {
                    res.status(400).json({ error: "File upload is required" });
                    return;
                }
                // Trim and fix request body keys
                const sanitizedBody = Object.keys(req.body).reduce((acc, key) => {
                    acc[key.trim()] = req.body[key];
                    return acc;
                }, {});
                // Extract and validate `amount`
                const rawAmount = sanitizedBody["amount"] || sanitizedBody["amount "]; // Handle space issue
                const amount = rawAmount ? Number(rawAmount) : NaN;
                if (!rawAmount || isNaN(amount) || amount < 1000) {
                    res.status(400).json({ error: "Loan amount must be at least 1,000 and a valid number." });
                    return;
                }
                // Upload file to Cloudinary
                let uploadedFile;
                try {
                    uploadedFile = yield (0, CloudinaryUploader_1.uploadFileToCloudinary)(customReq.file.buffer, "account_statements");
                }
                catch (error) {
                    res.status(500).json({ error: "File upload failed" });
                    return;
                }
                if (!(uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.secure_url)) {
                    res.status(500).json({ error: "File upload returned no URL" });
                    return;
                }
                // Validate employmentStatus
                const validEmploymentStatuses = ["Employed", "Self-employed", "Business owner", "Student"];
                if (!validEmploymentStatuses.includes(sanitizedBody.employmentStatus)) {
                    res.status(400).json({ error: "Invalid employment status." });
                    return;
                }
                // Validate maritalStatus
                const validMaritalStatuses = ["Married", "Single", "Divorced", "Student"];
                if (!validMaritalStatuses.includes(sanitizedBody.maritalStatus)) {
                    res.status(400).json({ error: "Invalid marital status." });
                    return;
                }
                // Create DTO with validated data
                const data = new applyLoan_dto_1.ApplyLoanDTO();
                data.amount = amount;
                data.homeAddress = sanitizedBody.homeAddress;
                data.employmentStatus = sanitizedBody.employmentStatus;
                data.maritalStatus = sanitizedBody.maritalStatus;
                data.accountStatement = uploadedFile.secure_url;
                // Validate DTO
                const errors = yield (0, class_validator_1.validate)(data);
                if (errors.length > 0) {
                    res.status(400).json({ message: "Validation failed", errors });
                    return;
                }
                // Send data to loanService
                yield this.loanService.applyForLoan(data, userId);
                res.status(201).json({ message: "Loan application submitted successfully" });
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
                const repaymentResult = yield this.loanService.repayLoan(userId);
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
        this.getUserActiveLoan = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userAuth;
                const result = yield this.loanService.getUserActiveLoan(userId);
                res.status(http_status_codes_1.StatusCodes.OK).send(result);
            }
            catch (error) {
                next(error);
            }
        });
        this.loanService = new loan_service_impl_1.LoanServiceImpl();
    }
}
exports.LoanController = LoanController;
