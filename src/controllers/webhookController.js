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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhook = void 0;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../configs/db");
const socket_1 = require("../configs/socket");
const SECRET_KEY = process.env.PAYMENT_SECRET; // Replace with actual webhook secret
const paymentWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signature = req.headers["x-paystack-signature"] || req.headers["x-flw-signature"];
        const rawBody = JSON.stringify(req.body);
        // ✅ Verify the request is from the payment provider
        const expectedSignature = crypto_1.default.createHmac("sha512", SECRET_KEY).update(rawBody).digest("hex");
        if (signature !== expectedSignature) {
            return res.status(401).json({ message: "Unauthorized webhook request" });
        }
        const { event, data } = req.body;
        switch (event) {
            case "charge.success":
                yield handleSuccessfulPayment(data);
                break;
            case "transfer.success":
                yield handleSuccessfulTransfer(data);
                break;
            case "loan.repayment":
                yield handleLoanRepayment(data);
                break;
            case "contribution.payment":
                yield handleContributionPayment(data);
                break;
            case "bill.payment":
                yield handleBillPayment(data);
                break;
            case "investment.payment":
                yield handleInvestmentPayment(data);
                break;
            default:
                console.log(`Unhandled webhook event: ${event}`);
        }
        return res.status(200).json({ status: "success" });
    }
    catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ message: "Webhook processing failed" });
    }
});
exports.paymentWebhook = paymentWebhook;
// ✅ Helper function to prevent duplicate processing
const isProcessed = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTransaction = yield db_1.db.transaction.findUnique({
        where: { id: transactionId },
    });
    return !!existingTransaction;
});
// ✅ Handle Successful Payment
const handleSuccessfulPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isProcessed(data.id))
        return;
    yield db_1.db.transaction.create({
        data: {
            id: data.id,
            userId: data.metadata.userId,
            amount: data.amount / 100,
            type: "DEPOSIT",
        },
    });
    yield db_1.db.user.update({
        where: { id: data.metadata.userId },
        data: {
            balance: { increment: data.amount / 100 },
        },
    });
    socket_1.io.emit(`payment_success_${data.metadata.userId}`, { amount: data.amount / 100, status: "SUCCESS" });
});
// ✅ Handle Successful Transfer
const handleSuccessfulTransfer = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isProcessed(data.id))
        return;
    yield db_1.db.transaction.create({
        data: {
            id: data.id,
            userId: data.metadata.userId,
            amount: data.amount / 100,
            type: "TRANSFER",
        },
    });
});
// ✅ Handle Loan Repayment
const handleLoanRepayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isProcessed(data.id))
        return;
    yield db_1.db.loan.update({
        where: { id: data.metadata.loanId },
        data: {
            paidAmount: { increment: data.amount / 100 },
        },
    });
});
// ✅ Handle Contribution Payment
const handleContributionPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isProcessed(data.id))
        return;
    yield db_1.db.contributionMember.update({
        where: { id: data.metadata.contributionId },
        data: {
            status: "PAID",
        },
    });
});
// ✅ Handle Bill Payment
const handleBillPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isProcessed(data.id))
        return;
    yield db_1.db.billPayment.update({
        where: { id: data.metadata.billId },
        data: {
            status: "PAID",
        },
    });
});
// ✅ Handle Investment Payment
const handleInvestmentPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield isProcessed(data.id))
        return;
    yield db_1.db.investment.update({
        where: { id: data.metadata.investmentId },
        data: {
            status: "PAID",
        },
    });
});
