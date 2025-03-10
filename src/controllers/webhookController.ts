import { Request, Response } from "express";
import crypto from "crypto";
import { db } from "../configs/db";
import { io } from "../configs/socket";

const SECRET_KEY = process.env.PAYMENT_SECRET!; // Replace with actual webhook secret

export const paymentWebhook = async (req: Request, res: Response) => {
    try {
        const signature = req.headers["x-paystack-signature"] || req.headers["x-flw-signature"];
        const rawBody = JSON.stringify(req.body);
        
        // ✅ Verify the request is from the payment provider
        const expectedSignature = crypto.createHmac("sha512", SECRET_KEY).update(rawBody).digest("hex");
        if (signature !== expectedSignature) {
            return res.status(401).json({ message: "Unauthorized webhook request" });
        }

        const { event, data } = req.body;

        switch (event) {
            case "charge.success":
                await handleSuccessfulPayment(data);
                break;
            case "transfer.success":
                await handleSuccessfulTransfer(data);
                break;
            case "loan.repayment":
                await handleLoanRepayment(data);
                break;
            case "contribution.payment":
                await handleContributionPayment(data);
                break;
            case "bill.payment":
                await handleBillPayment(data);
                break;
            case "investment.payment":
                await handleInvestmentPayment(data);
                break;
            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        return res.status(200).json({ status: "success" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ message: "Webhook processing failed" });
    }
};

// ✅ Helper function to prevent duplicate processing
const isProcessed = async (transactionId: string) => {
    const existingTransaction = await db.transaction.findUnique({
        where: { id: transactionId },
    });
    return !!existingTransaction;
};

// ✅ Handle Successful Payment
const handleSuccessfulPayment = async (data: any) => {
    if (await isProcessed(data.id)) return;

    await db.transaction.create({
        data: {
            id: data.id,
            userId: data.metadata.userId,
            amount: data.amount / 100,
            type: "DEPOSIT",
        },
    });

    await db.user.update({
        where: { id: data.metadata.userId },
        data: {
            balance: { increment: data.amount / 100 },
        },
    });

    io.emit(`payment_success_${data.metadata.userId}`, { amount: data.amount / 100, status: "SUCCESS" });
};

// ✅ Handle Successful Transfer
const handleSuccessfulTransfer = async (data: any) => {
    if (await isProcessed(data.id)) return;

    await db.transaction.create({
        data: {
            id: data.id,
            userId: data.metadata.userId,
            amount: data.amount / 100,
            type: "TRANSFER",
        },
    });
};

// ✅ Handle Loan Repayment
const handleLoanRepayment = async (data: any) => {
    if (await isProcessed(data.id)) return;

    await db.loan.update({
        where: { id: data.metadata.loanId },
        data: {
            paidAmount: { increment: data.amount / 100 },
        },
    });
};

// ✅ Handle Contribution Payment
const handleContributionPayment = async (data: any) => {
    if (await isProcessed(data.id)) return;

    await db.contributionMember.update({
        where: { id: data.metadata.contributionId },
        data: {
            status: "PAID",
        },
    });
};

// ✅ Handle Bill Payment
const handleBillPayment = async (data: any) => {
    if (await isProcessed(data.id)) return;

    await db.billPayment.update({
        where: { id: data.metadata.billId },
        data: {
            status: "PAID",
        },
    });
};

// ✅ Handle Investment Payment
const handleInvestmentPayment = async (data: any) => {
    if (await isProcessed(data.id)) return;

    await db.investment.update({
        where: { id: data.metadata.investmentId },
        data: {
            status: "PAID",
        },
    });
};
