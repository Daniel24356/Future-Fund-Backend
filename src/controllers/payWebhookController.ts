import crypto from "crypto";
import { Request, Response } from "express";
import { db } from "../configs/db";
import { io } from "../configs/socket";
import { TransactionType, PaymentStatus, LoanStatus } from "@prisma/client";

const PAYSTACK_WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

export const paystackWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const signature = req.headers["x-paystack-signature"] as string;
        if (!signature) {
             res.status(401).json({ message: "Unauthorized webhook request - No signature" });
        }

        const hash = crypto
            .createHmac("sha512", PAYSTACK_WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest("hex"); // Ensure the correct hex encoding

        if (!crypto.timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(hash, "utf8"))) {
             res.status(401).json({ message: "Unauthorized webhook request - Invalid signature" });
        }

        console.log("Signature Verified Successfully");

        const parsedBody = JSON.parse(req.body.toString()); 
        const { event, data } = parsedBody;
        const userId = data.metadata?.userId;
        const amount = data.amount / 100; // Convert from kobo to naira

        if (!userId) {
             res.status(400).json({ message: "Invalid webhook data: userId missing" });
        }

        switch (event) {
            case "charge.success": // ✅ Deposit
                await db.$transaction([
                    db.transaction.create({
                        data: {
                            userId,
                            amount,
                            type: TransactionType.DEPOSIT,
                            description: `Deposit of ₦${amount}`,
                        },
                    }),
                    db.user.update({
                        where: { id: userId },
                        data: { balance: { increment: amount } },
                    }),
                ]);

                io.emit(`payment_success_${userId}`, { amount, status: PaymentStatus.PAID });
                break;

            case "transfer.success": // ✅ Withdrawal
                await db.transaction.create({
                    data: {
                        userId,
                        amount,
                        type: TransactionType.WITHDRAWAL,
                        description: `Withdrawal of ₦${amount}`,
                    },
                });

                io.emit(`withdrawal_success_${userId}`, { amount, status: PaymentStatus.PAID });
                break;

            case "loan.repayment": // ✅ Loan Repayment
                await db.$transaction([
                    db.transaction.create({
                        data: {
                            userId,
                            amount,
                            type: TransactionType.LOAN_REPAYMENT,
                            description: `Loan repayment of ₦${amount}`,
                        },
                    }),
                    db.loan.updateMany({
                        where: { userId, status: LoanStatus.ACTIVE },
                        data: { paidAmount: { increment: amount } },
                    }),
                ]);

                io.emit(`loan_repayment_${userId}`, { amount, status: PaymentStatus.PAID });
                break;

            case "bill.payment": // ✅ Bill Payment
                await db.billPayment.updateMany({
                    where: { userId, referenceId: data.reference },
                    data: { status: PaymentStatus.PAID },
                });

                io.emit(`bill_payment_${userId}`, { amount, status: PaymentStatus.PAID });
                break;

            case "investment.success": // ✅ Investment
                await db.investment.updateMany({
                    where: { userId, status: PaymentStatus.UNPAID },
                    data: { status: PaymentStatus.PAID },
                });

                io.emit(`investment_success_${userId}`, { amount, status: PaymentStatus.PAID });
                break;

            case "contribution.payment": // ✅ Contribution Payment
                await db.$transaction([
                    db.transaction.create({
                        data: {
                            userId,
                            amount,
                            type: TransactionType.CONTRIBUTION,
                            description: `Contribution payment of ₦${amount}`,
                        },
                    }),
                    db.contributionMember.updateMany({
                        where: { userId, status: PaymentStatus.UNPAID },
                        data: { status: PaymentStatus.PAID },
                    }),
                ]);

                io.emit(`contribution_payment_${userId}`, { amount, status: PaymentStatus.PAID });
                break;

            default:
                console.log("Unhandled Paystack event:", event);
        }

         res.status(200).json({ status: "success" });
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ message: "Webhook processing failed" });
    }
};