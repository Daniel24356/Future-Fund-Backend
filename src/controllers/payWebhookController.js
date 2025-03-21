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
exports.paystackWebhook = void 0;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../configs/db");
const socket_1 = require("../configs/socket");
const client_1 = require("@prisma/client");
const PAYSTACK_WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const paystackWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const signature = req.headers["x-paystack-signature"];
        if (!signature) {
            res.status(401).json({ message: "Unauthorized webhook request - No signature" });
        }
        const hash = crypto_1.default
            .createHmac("sha512", PAYSTACK_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest("hex"); // Ensure the correct hex encoding
        if (!crypto_1.default.timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(hash, "utf8"))) {
            res.status(401).json({ message: "Unauthorized webhook request - Invalid signature" });
        }
        console.log("Signature Verified Successfully");
        const parsedBody = JSON.parse(req.body.toString());
        const { event, data } = parsedBody;
        const userId = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.userId;
        const amount = data.amount / 100; // Convert from kobo to naira
        if (!userId) {
            res.status(400).json({ message: "Invalid webhook data: userId missing" });
        }
        switch (event) {
            case "charge.success": // ✅ Deposit
                yield db_1.db.$transaction([
                    db_1.db.transaction.create({
                        data: {
                            userId,
                            amount,
                            type: client_1.TransactionType.DEPOSIT,
                            description: `Deposit of ₦${amount}`,
                        },
                    }),
                    db_1.db.user.update({
                        where: { id: userId },
                        data: { balance: { increment: amount } },
                    }),
                ]);
                socket_1.io.emit(`payment_success_${userId}`, { amount, status: client_1.PaymentStatus.PAID });
                break;
            case "transfer.success": // ✅ Withdrawal
                yield db_1.db.transaction.create({
                    data: {
                        userId,
                        amount,
                        type: client_1.TransactionType.WITHDRAWAL,
                        description: `Withdrawal of ₦${amount}`,
                    },
                });
                socket_1.io.emit(`withdrawal_success_${userId}`, { amount, status: client_1.PaymentStatus.PAID });
                break;
            case "loan.repayment": // ✅ Loan Repayment
                yield db_1.db.$transaction([
                    db_1.db.transaction.create({
                        data: {
                            userId,
                            amount,
                            type: client_1.TransactionType.LOAN_REPAYMENT,
                            description: `Loan repayment of ₦${amount}`,
                        },
                    }),
                    db_1.db.loan.updateMany({
                        where: { userId, status: client_1.LoanStatus.ACTIVE },
                        data: { paidAmount: { increment: amount } },
                    }),
                ]);
                socket_1.io.emit(`loan_repayment_${userId}`, { amount, status: client_1.PaymentStatus.PAID });
                break;
            case "bill.payment": // ✅ Bill Payment
                yield db_1.db.billPayment.updateMany({
                    where: { userId, referenceId: data.reference },
                    data: { status: client_1.PaymentStatus.PAID },
                });
                socket_1.io.emit(`bill_payment_${userId}`, { amount, status: client_1.PaymentStatus.PAID });
                break;
            case "investment.success": // ✅ Investment
                yield db_1.db.investment.updateMany({
                    where: { userId, status: client_1.PaymentStatus.UNPAID },
                    data: { status: client_1.PaymentStatus.PAID },
                });
                socket_1.io.emit(`investment_success_${userId}`, { amount, status: client_1.PaymentStatus.PAID });
                break;
            case "contribution.payment": // ✅ Contribution Payment
                yield db_1.db.$transaction([
                    db_1.db.transaction.create({
                        data: {
                            userId,
                            amount,
                            type: client_1.TransactionType.CONTRIBUTION,
                            description: `Contribution payment of ₦${amount}`,
                        },
                    }),
                    db_1.db.contributionMember.updateMany({
                        where: { userId, status: client_1.PaymentStatus.UNPAID },
                        data: { status: client_1.PaymentStatus.PAID },
                    }),
                ]);
                socket_1.io.emit(`contribution_payment_${userId}`, { amount, status: client_1.PaymentStatus.PAID });
                break;
            default:
                console.log("Unhandled Paystack event:", event);
        }
        res.status(200).json({ status: "success" });
    }
    catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ message: "Webhook processing failed" });
    }
});
exports.paystackWebhook = paystackWebhook;
